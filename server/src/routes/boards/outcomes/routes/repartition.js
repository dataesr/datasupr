import express from "express";
import { db } from "../../../../services/mongo.js";
import { ENSEMBLE_DEFAULTS, FILTER_FIELDS, VALUE_MAPS } from "./_common.js";

const router = new express.Router();

const COLLECTION = "outcomes-repartition";
const DEFAULT_RELATIVE_YEARS = [0, 1, 2, 3, 4];

const TAUX_TO_SITUATION = {
  taux_LG1: "SIT01",
  taux_LG2: "SIT02",
  taux_LG3: "SIT03",
  taux_LP: "SIT09",
  taux_M1: "SIT04",
  taux_M2: "SIT05",
  taux_STS: "SIT06",
  taux_CPGE: "SIT07",
  taux_IUT: "SIT08",
  taux_SANTE: "SIT10",
  taux_INGECOM: "SIT11",
  taux_AUTRES: "SIT12",
  taux_DIPL: "SIT_DIPL",
  taux_SORT_NDIPL: "SIT13",
};

function getCollection() {
  return db.collection(COLLECTION);
}

function buildSelectedFilters(query) {
  return FILTER_FIELDS.reduce((acc, field) => {
    const requested = query[field];
    acc[field] =
      requested && requested !== "all" ? requested : ENSEMBLE_DEFAULTS[field];
    return acc;
  }, {});
}

function anneeStartYear(annee) {
  const v = Number.parseInt(String(annee).split("-")[0], 10);
  return Number.isInteger(v) ? v : null;
}

function toNumberOrZero(value) {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildDistribution(docs, relativeYearSet) {
  const distribution = [];

  const sortedDocs = [...docs]
    .filter((doc) => anneeStartYear(doc?.annee) !== null)
    .sort((a, b) => anneeStartYear(a.annee) - anneeStartYear(b.annee));

  const referenceTot = toNumberOrZero(sortedDocs[0]?.tot);

  sortedDocs.forEach((doc, index) => {
    const annee_rel = index;
    if (!relativeYearSet.has(annee_rel)) return;

    Object.entries(TAUX_TO_SITUATION).forEach(([tauxField, situation]) => {
      const taux = toNumberOrZero(doc?.[tauxField]);
      if (taux <= 0) return;
      const count = Math.round((referenceTot * taux) / 100);
      distribution.push({ annee_rel, situation, count });
    });
  });

  return distribution;
}

async function getFilterOptions(collection, field, selectedFilters) {
  const fieldMap = VALUE_MAPS[field] || {};
  const match = {};

  FILTER_FIELDS.forEach((other) => {
    if (other !== field) {
      match[other] = selectedFilters[other];
    }
  });

  const values = await collection.distinct(field, match);

  return values
    .filter((key) => key && key !== ENSEMBLE_DEFAULTS[field])
    .map((key) => ({ key, label: fieldMap[key] || key }))
    .sort((a, b) => String(a.key).localeCompare(String(b.key)));
}

router.route("/outcomes/repartition").get(async (req, res) => {
  const query = req.query;

  if (!query.cohorte_annee) {
    return res.status(400).send("cohorte_annee is required");
  }

  const selectedFilters = buildSelectedFilters(query);
  const requestedYears = (query.annee_rel || "")
    .split(",")
    .map((y) => Number.parseInt(y, 10))
    .filter((y) => Number.isInteger(y) && DEFAULT_RELATIVE_YEARS.includes(y));
  const relativeYears =
    requestedYears.length > 0 ? requestedYears : DEFAULT_RELATIVE_YEARS;
  const relativeYearSet = new Set(relativeYears);

  const collection = getCollection();

  try {
    const [docs, ...filterOptionsEntries] = await Promise.all([
      collection.find(selectedFilters).toArray(),
      ...FILTER_FIELDS.map((field) =>
        getFilterOptions(collection, field, selectedFilters)
      ),
    ]);

    const distribution = buildDistribution(docs, relativeYearSet);

    const sortedDocs = [...docs]
      .filter((doc) => anneeStartYear(doc?.annee) !== null)
      .sort((a, b) => anneeStartYear(a.annee) - anneeStartYear(b.annee));
    const totalStudents = toNumberOrZero(sortedDocs[0]?.tot);

    const filterOptions = FILTER_FIELDS.reduce((acc, field, index) => {
      acc[field] = filterOptionsEntries[index];
      return acc;
    }, {});

    return res.json({
      cohort: {
        annee: query.cohorte_annee,
        situation: query.cohorte_situation || "SIT01",
      },
      distribution,
      filterOptions,
      filters: { cohorte_annee: query.cohorte_annee, ...selectedFilters },
      relativeYears,
      totalStudents,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
