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
    .filter((value) => Number.isInteger(value));

  return parsedRelativeYears.length > 0
    ? parsedRelativeYears
    : DEFAULT_RELATIVE_YEARS;
}

function parseMinValue(rawMinValue) {
  const requestedMinValue = Number.parseInt(rawMinValue, 10);
  return Number.isInteger(requestedMinValue)
    ? requestedMinValue
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

function filterPreaggregatedLinks(links, relativeYears, minValue) {
  const relativeYearSet = new Set(relativeYears);

  return links
    .map(normalizePreaggregatedLink)
    .filter((link) => Number.isFinite(link.value) && link.value >= minValue)
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

  const results = await collection
    .aggregate([
      { $match: match },
      {
        $group: {
          _id: `$filters.${field}`,
          count: { $sum: "$count" },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          key: "$_id",
        },
      },
      { $sort: { key: 1 } },
    ])
    .toArray();

  return results.map((result) => ({
    ...result,
    label: fieldMap[result.key] || result.key,
  }));
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
      totalStudents: Number(entry?.count) || 0,
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
