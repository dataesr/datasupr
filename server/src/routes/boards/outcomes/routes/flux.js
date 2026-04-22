import express from "express";
import { db } from "../../../../services/mongo.js";
import { recreateIndex } from "../../../utils.js";
import {
  ENSEMBLE_DEFAULTS,
  FILTER_FIELDS,
  VALUE_MAPS,
  parseListParam,
} from "./_common.js";

const router = new express.Router();

const COLLECTION = "outcomes-cohortL1";
const DEFAULT_RELATIVE_YEARS = [0, 1, 2, 3, 4];
const DEFAULT_MIN_VALUE = 100;

function getCollection() {
  return db.collection(COLLECTION);
}

function buildPreaggregatedFilters(query) {
  return FILTER_FIELDS.reduce((accumulator, field) => {
    const requestedValue = query[field];
    accumulator[field] =
      requestedValue && requestedValue !== "all"
        ? requestedValue
        : ENSEMBLE_DEFAULTS[field];
    return accumulator;
  }, {});
}

function parseRelativeYears(rawRelativeYears) {
  const parsedRelativeYears = parseListParam(rawRelativeYears)
    .map((value) => Number.parseInt(value, 10))
    .filter(
      (value) =>
        Number.isInteger(value) && DEFAULT_RELATIVE_YEARS.includes(value)
    );

  if (parsedRelativeYears.length === 0) {
    return DEFAULT_RELATIVE_YEARS;
  }

  const maxYear = Math.max(...parsedRelativeYears);

  return DEFAULT_RELATIVE_YEARS.filter((year) => year <= maxYear);
}

function parseMinValue(rawMinValue) {
  const requestedMinValue = Number.parseInt(rawMinValue, 10);
  return Number.isInteger(requestedMinValue)
    ? Math.max(0, requestedMinValue)
    : DEFAULT_MIN_VALUE;
}

function buildFilterOptionsPayload(entries) {
  return FILTER_FIELDS.reduce((accumulator, field, index) => {
    accumulator[field] = entries[index];
    return accumulator;
  }, {});
}

function normalizeRelativeValue(value) {
  if (Number.isInteger(value)) {
    return value;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) ? parsedValue : null;
}

function normalizePreaggregatedLink(rawLink) {
  const sourceSituation = rawLink.source_situation ?? rawLink.source_situ;
  const targetSituation = rawLink.target_situation ?? rawLink.target_situ;

  return {
    source_annee: rawLink.source_annee,
    source_rel: normalizeRelativeValue(rawLink.source_rel),
    source_situation: sourceSituation,
    target_annee: rawLink.target_annee,
    target_rel: normalizeRelativeValue(rawLink.target_rel),
    target_situation: targetSituation,
    value: Number(rawLink.value),
  };
}

function computeStudentsTotalFromLinks(rawLinks, fallbackCount = 0) {
  if (!Array.isArray(rawLinks) || rawLinks.length === 0) {
    return Number.isFinite(Number(fallbackCount)) ? Number(fallbackCount) : 0;
  }

  const totalFromYear0 = rawLinks
    .map(normalizePreaggregatedLink)
    .filter((link) => link.source_rel === 0)
    .reduce(
      (sum, link) => sum + (Number.isFinite(link.value) ? link.value : 0),
      0
    );

  if (totalFromYear0 > 0) {
    return totalFromYear0;
  }

  return Number.isFinite(Number(fallbackCount)) ? Number(fallbackCount) : 0;
}

function filterPreaggregatedLinks(links, relativeYears, minValue) {
  const relativeYearSet = new Set(relativeYears);

  return links
    .map(normalizePreaggregatedLink)
    .filter(
      (link) =>
        Number.isFinite(link.value) && link.value > 0 && link.value >= minValue
    )
    .filter((link) => {
      const sourceRel = link.source_rel;
      const targetRel = link.target_rel;

      if (sourceRel === null || targetRel === null) {
        return false;
      }

      if (!link.source_situation || !link.target_situation) {
        return false;
      }

      return relativeYearSet.has(sourceRel) && relativeYearSet.has(targetRel);
    })
    .sort((a, b) => {
      const sourceRelA = normalizeRelativeValue(a.source_rel) ?? 999;
      const sourceRelB = normalizeRelativeValue(b.source_rel) ?? 999;

      if (sourceRelA !== sourceRelB) {
        return sourceRelA - sourceRelB;
      }

      const targetRelA = normalizeRelativeValue(a.target_rel) ?? 999;
      const targetRelB = normalizeRelativeValue(b.target_rel) ?? 999;

      if (targetRelA !== targetRelB) {
        return targetRelA - targetRelB;
      }

      return Number(b.value) - Number(a.value);
    });
}

async function getFilterOptionsFromPreaggregated(
  collection,
  field,
  selectedFilters
) {
  const fieldMap = VALUE_MAPS[field] || {};
  const match = {};

  FILTER_FIELDS.forEach((filterField) => {
    if (filterField !== field) {
      match[`filters.${filterField}`] = selectedFilters[filterField];
    }
  });

  const docs = await collection
    .find(match, { projection: { count: 1, data: 1, [`filters.${field}`]: 1 } })
    .toArray();

  return docs
    .map((doc) => {
      const key = doc?.filters?.[field];
      const count = computeStudentsTotalFromLinks(doc?.data, doc?.count);

      return {
        count,
        key,
        label: fieldMap[key] || key,
      };
    })
    .filter((option) => option.key && option.key !== ENSEMBLE_DEFAULTS[field])
    .sort((a, b) => String(a.key).localeCompare(String(b.key)));
}

router.route("/outcomes/flux").get(async (req, res) => {
  const query = req.query;

  if (!query.cohorte_annee || !query.cohorte_situation) {
    return res
      .status(400)
      .send("cohorte_annee and cohorte_situation are required");
  }

  const collection = getCollection();
  const selectedRelativeYears = parseRelativeYears(query.annee_rel);
  const selectedMinValue = parseMinValue(query.min_value);
  const filters = buildPreaggregatedFilters(query);

  try {
    const [entry, ...filterOptionsEntries] = await Promise.all([
      collection.findOne({ filters }),
      ...FILTER_FIELDS.map((field) =>
        getFilterOptionsFromPreaggregated(collection, field, filters)
      ),
    ]);

    const links = filterPreaggregatedLinks(
      Array.isArray(entry?.data) ? entry.data : [],
      selectedRelativeYears,
      selectedMinValue
    );
    const totalStudents = computeStudentsTotalFromLinks(
      entry?.data,
      entry?.count
    );

    return res.json({
      cohort: {
        annee: query.cohorte_annee,
        situation: query.cohorte_situation,
      },
      filterOptions: buildFilterOptionsPayload(filterOptionsEntries),
      filters,
      links,
      minValue: selectedMinValue,
      relativeYears: selectedRelativeYears,
      totalStudents,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.route("/outcomes/flux_indexes").get(async (req, res) => {
  try {
    const collection = getCollection();

    await recreateIndex(
      collection,
      {
        "filters.groupe_disciplinaire": 1,
        "filters.sexe": 1,
        "filters.origine_sociale": 1,
        "filters.bac_type": 1,
        "filters.bac_mention": 1,
        "filters.retard_scolaire": 1,
        "filters.devenir_en_un_an": 1,
        "filters.type_de_trajectoire": 1,
      },
      "idx_flux_preagg_filters"
    );

    res
      .status(201)
      .json({ message: "Index outcomes-cohortL1 créés avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création des index:", error);
    res.status(500).json({ error: "Erreur lors de la création des index" });
  }
});

export default router;
