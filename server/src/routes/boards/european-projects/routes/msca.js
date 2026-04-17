import express from "express";
import { db } from "../../../../services/mongo.js";

const router = new express.Router();

const COLLECTION_NAME = "european-projects_msca-projects-synthese_staging";

/**
 * Route de synthèse MSCA - agrège les données globales pour les cartes de synthèse
 * Paramètres optionnels :
 * - country_code : code du pays (ex: FRA)
 * - call_year    : années séparées par virgule (ex: 2021,2022)
 * - destination_code : code(s) de destination (ex: PF,DN)
 */
router.route("/european-projects/msca/synthesis").get(async (req, res) => {
  const filters = {};

  if (req.query.call_year) {
    filters.call_year = { $in: req.query.call_year.split(",") };
  }
  if (req.query.destination_code) {
    filters.destination_code = { $in: req.query.destination_code.split(",") };
  }
  if (req.query.framework) {
    filters.framework = req.query.framework;
  }

  const buildPipeline = (stage) => [
    { $match: { ...filters, stage } },
    {
      $group: {
        _id: "$country_code",
        total_funding: { $sum: "$fund_eur" },
        total_involved: { $sum: "$number_involved" },
        total_coordinations: {
          $sum: { $cond: [{ $eq: ["$role_participant", "Coordinator"] }, "$number_involved", 0] },
        },
        project_ids: { $addToSet: "$project_id" },
        country_name_fr: { $first: "$country_name_fr" },
        country_name_en: { $first: "$country_name_en" },
      },
    },
    {
      $project: {
        _id: 0,
        country_code: "$_id",
        country_name_fr: 1,
        country_name_en: 1,
        total_funding: 1,
        total_involved: 1,
        total_coordinations: 1,
        total_projects: { $size: "$project_ids" },
      },
    },
    {
      $group: {
        _id: null,
        total_funding: { $sum: "$total_funding" },
        total_involved: { $sum: "$total_involved" },
        total_coordinations: { $sum: "$total_coordinations" },
        total_projects: { $sum: "$total_projects" },
        countries: { $push: "$$ROOT" },
      },
    },
    { $project: { _id: 0, total_funding: 1, total_involved: 1, total_coordinations: 1, total_projects: 1, countries: 1 } },
  ];

  const [dataSuccessful, dataEvaluated] = await Promise.all([
    db.collection(COLLECTION_NAME).aggregate(buildPipeline("successful")).toArray(),
    db.collection(COLLECTION_NAME).aggregate(buildPipeline("evaluated")).toArray(),
  ]);

  const filterByCountry = (record, countryCode) =>
    record
      ? {
          total_funding: record.total_funding,
          total_involved: record.total_involved,
          total_coordinations: record.total_coordinations,
          total_projects: record.total_projects,
          countries: (record.countries || []).filter((c) => c.country_code?.toUpperCase() === countryCode),
        }
      : null;

  if (req.query.country_code) {
    const cc = req.query.country_code.toUpperCase();
    return res.json({
      successful: filterByCountry(dataSuccessful[0], cc),
      evaluated: filterByCountry(dataEvaluated[0], cc),
    });
  }

  res.json({
    successful: dataSuccessful[0] || null,
    evaluated: dataEvaluated[0] || null,
  });
});

/**
 * Route de synthèse par type de financement MSCA (destination)
 * Retourne les données agrégées par destination_code (PF, DN, SE, COFUND…)
 */
router.route("/european-projects/msca/synthesis-by-destination").get(async (req, res) => {
  const filters = {};

  if (req.query.call_year) {
    filters.call_year = { $in: req.query.call_year.split(",") };
  }
  if (req.query.framework) {
    filters.framework = req.query.framework;
  }
  if (req.query.country_code) {
    filters.country_code = req.query.country_code.toUpperCase();
  }

  const data = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            destination_code: "$destination_code",
            destination_name_en: "$destination_name_en",
            stage: "$stage",
          },
          total_funding: { $sum: "$fund_eur" },
          total_involved: { $sum: "$number_involved" },
          total_coordinations: {
            $sum: { $cond: [{ $eq: ["$role_participant", "Coordinator"] }, "$number_involved", 0] },
          },
          project_ids: { $addToSet: "$project_id" },
        },
      },
      {
        $project: {
          _id: 0,
          destination_code: "$_id.destination_code",
          destination_name_en: "$_id.destination_name_en",
          stage: "$_id.stage",
          total_funding: 1,
          total_involved: 1,
          total_coordinations: 1,
          total_projects: { $size: "$project_ids" },
        },
      },
      { $sort: { destination_code: 1, stage: 1 } },
    ])
    .toArray();

  // Restructurer par destination
  const destinations = {};
  data.forEach((item) => {
    if (!destinations[item.destination_code]) {
      destinations[item.destination_code] = {
        destination_code: item.destination_code,
        destination_name_en: item.destination_name_en,
        evaluated: null,
        successful: null,
      };
    }
    destinations[item.destination_code][item.stage] = {
      total_funding: item.total_funding,
      total_involved: item.total_involved,
      total_coordinations: item.total_coordinations,
      total_projects: item.total_projects,
    };
  });

  res.json(Object.values(destinations));
});

/**
 * Route de filtres MSCA - retourne les années disponibles et leur répartition par framework
 */
router.route("/european-projects/msca/filters").get(async (req, res) => {
  const [years, destinations, frameworks, yearsByFrameworkRaw] = await Promise.all([
    db.collection(COLLECTION_NAME).distinct("call_year"),
    db
      .collection(COLLECTION_NAME)
      .aggregate([
        { $group: { _id: { code: "$destination_code", name: "$destination_name_en" } } },
        { $project: { _id: 0, code: "$_id.code", name: "$_id.name" } },
        { $sort: { code: 1 } },
      ])
      .toArray(),
    db.collection(COLLECTION_NAME).distinct("framework"),
    db
      .collection(COLLECTION_NAME)
      .aggregate([
        { $group: { _id: { framework: "$framework", call_year: "$call_year" } } },
        { $group: { _id: "$_id.framework", years: { $addToSet: "$_id.call_year" } } },
        { $project: { _id: 0, framework: "$_id", years: 1 } },
      ])
      .toArray(),
  ]);

  const yearsByFramework = yearsByFrameworkRaw.reduce((acc, { framework, years: fwYears }) => {
    acc[framework] = fwYears.sort();
    return acc;
  }, {});

  res.json({
    years: years.sort(),
    destinations,
    frameworks,
    yearsByFramework,
  });
});

export default router;
