import express from "express";
import { db } from "../../../../services/mongo.js";

const router = new express.Router();

const COLLECTION_NAME = "european-projects_erc-projects-synthese_staging";

/**
 * Route de synthèse ERC - récupère les données agrégées pour les cartes de synthèse
 * Paramètres optionnels:
 * - country_code: code du pays (ex: FRA, CHE)
 * - call_year: années d'appel (ex: 2018,2019,2020)
 * - destination_code: codes de destination/type de financement (ex: COG,STG,ADG)
 * - panel_id: identifiants des panels (ex: SH4,LS9)
 */
router.route("/european-projects/erc/synthesis").get(async (req, res) => {
  const filters = {};

  if (req.query.call_year) {
    const years = req.query.call_year.split(",");
    filters.call_year = { $in: years };
  }
  if (req.query.destination_code) {
    const destinations = req.query.destination_code.split(",");
    filters.destination_code = { $in: destinations };
  }
  if (req.query.panel_id) {
    const panels = req.query.panel_id.split(",");
    filters.panel_id = { $in: panels };
  }
  if (req.query.framework) {
    filters.framework = req.query.framework;
  }

  // Données pour les projets lauréats (successful)
  const dataSuccessful = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { ...filters, stage: "successful" } },
      {
        $group: {
          _id: "$country_code",
          total_funding_project: { $sum: "$funding_project" },
          total_funding_entity: { $sum: "$funding_entity" },
          total_involved: { $sum: "$number_involved" },
          total_pi: { $sum: { $cond: [{ $eq: ["$role_entity", "PI"] }, "$number_involved", 0] } },
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
          total_funding_project: 1,
          total_funding_entity: 1,
          total_involved: 1,
          total_pi: 1,
        },
      },
      {
        $group: {
          _id: null,
          total_funding_project: { $sum: "$total_funding_project" },
          total_funding_entity: { $sum: "$total_funding_entity" },
          total_involved: { $sum: "$total_involved" },
          total_pi: { $sum: "$total_pi" },
          countries: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          total_funding_project: 1,
          total_funding_entity: 1,
          total_involved: 1,
          total_pi: 1,
          countries: 1,
        },
      },
    ])
    .toArray();

  // Données pour les projets évalués (evaluated)
  const dataEvaluated = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { ...filters, stage: "evaluated" } },
      {
        $group: {
          _id: "$country_code",
          total_funding_project: { $sum: "$funding_project" },
          total_funding_entity: { $sum: "$funding_entity" },
          total_involved: { $sum: "$number_involved" },
          total_pi: { $sum: { $cond: [{ $eq: ["$role_entity", "PI"] }, "$number_involved", 0] } },
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
          total_funding_project: 1,
          total_funding_entity: 1,
          total_involved: 1,
          total_pi: 1,
        },
      },
      {
        $group: {
          _id: null,
          total_funding_project: { $sum: "$total_funding_project" },
          total_funding_entity: { $sum: "$total_funding_entity" },
          total_involved: { $sum: "$total_involved" },
          total_pi: { $sum: "$total_pi" },
          countries: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          total_funding_project: 1,
          total_funding_entity: 1,
          total_involved: 1,
          total_pi: 1,
          countries: 1,
        },
      },
    ])
    .toArray();

  // Filtrer par pays si demandé
  if (req.query.country_code) {
    const countryCode = req.query.country_code.toUpperCase();
    return res.json({
      successful: dataSuccessful[0]
        ? {
            total_funding_project: dataSuccessful[0].total_funding_project,
            total_funding_entity: dataSuccessful[0].total_funding_entity,
            total_involved: dataSuccessful[0].total_involved,
            total_pi: dataSuccessful[0].total_pi,
            countries: dataSuccessful[0].countries.filter((el) => el.country_code.toUpperCase() === countryCode),
          }
        : null,
      evaluated: dataEvaluated[0]
        ? {
            total_funding_project: dataEvaluated[0].total_funding_project,
            total_funding_entity: dataEvaluated[0].total_funding_entity,
            total_involved: dataEvaluated[0].total_involved,
            total_pi: dataEvaluated[0].total_pi,
            countries: dataEvaluated[0].countries.filter((el) => el.country_code.toUpperCase() === countryCode),
          }
        : null,
    });
  }

  res.json({
    successful: dataSuccessful[0] || null,
    evaluated: dataEvaluated[0] || null,
  });
});

/**
 * Route de synthèse par type de financement ERC (destination)
 * Retourne les données agrégées par destination_code (STG, COG, ADG, SYG, POC)
 */
router.route("/european-projects/erc/synthesis-by-destination").get(async (req, res) => {
  const filters = {};

  if (req.query.call_year) {
    const years = req.query.call_year.split(",");
    filters.call_year = { $in: years };
  }
  if (req.query.panel_id) {
    const panels = req.query.panel_id.split(",");
    filters.panel_id = { $in: panels };
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
          total_funding_project: { $sum: "$funding_project" },
          total_funding_entity: { $sum: "$funding_entity" },
          total_involved: { $sum: "$number_involved" },
          total_pi: { $sum: { $cond: [{ $eq: ["$role_entity", "PI"] }, "$number_involved", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          destination_code: "$_id.destination_code",
          destination_name_en: "$_id.destination_name_en",
          stage: "$_id.stage",
          total_funding_project: 1,
          total_funding_entity: 1,
          total_involved: 1,
          total_pi: 1,
        },
      },
      { $sort: { destination_code: 1, stage: 1 } },
    ])
    .toArray();

  // Restructurer les données par destination
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
      total_funding_project: item.total_funding_project,
      total_funding_entity: item.total_funding_entity,
      total_involved: item.total_involved,
      total_pi: item.total_pi,
    };
  });

  res.json(Object.values(destinations));
});

/**
 * Route de synthèse par panel ERC
 * Retourne les données agrégées par panel_id
 * Paramètres optionnels:
 * - stage: "successful" (défaut) ou "evaluated"
 */
router.route("/european-projects/erc/synthesis-by-panel").get(async (req, res) => {
  const filters = {};
  const stage = req.query.stage || "successful";

  if (req.query.call_year) {
    const years = req.query.call_year.split(",");
    filters.call_year = { $in: years };
  }
  if (req.query.destination_code) {
    const destinations = req.query.destination_code.split(",");
    filters.destination_code = { $in: destinations };
  }
  if (req.query.framework) {
    filters.framework = req.query.framework;
  }
  if (req.query.country_code) {
    filters.country_code = req.query.country_code.toUpperCase();
  }
  // Filtrer sur les PI uniquement pour les porteurs de projets
  filters.role_entity = "PI";

  const data = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { ...filters, stage } },
      {
        $group: {
          _id: {
            panel_id: "$panel_id",
            panel_name: "$panel_name",
            panel_lib: "$panel_lib",
            domaine_scientifique: "$domaine_scientifique",
            domaine_name_scientifique: "$domaine_name_scientifique",
            destination_code: "$destination_code",
            destination_name_en: "$destination_name_en",
          },
          total_funding_entity: { $sum: "$funding_entity" },
          total_pi: { $sum: "$number_involved" },
        },
      },
      {
        $project: {
          _id: 0,
          panel_id: "$_id.panel_id",
          panel_name: "$_id.panel_name",
          panel_lib: "$_id.panel_lib",
          domaine_scientifique: "$_id.domaine_scientifique",
          domaine_name_scientifique: "$_id.domaine_name_scientifique",
          destination_code: "$_id.destination_code",
          destination_name_en: "$_id.destination_name_en",
          total_funding_entity: 1,
          total_pi: 1,
        },
      },
      { $sort: { domaine_scientifique: 1, panel_id: 1 } },
    ])
    .toArray();

  res.json(data);
});

/**
 * Route d'évolution temporelle ERC
 * Retourne les données agrégées par année et type de financement
 */
router.route("/european-projects/erc/evolution").get(async (req, res) => {
  const filters = {};

  if (req.query.destination_code) {
    const destinations = req.query.destination_code.split(",");
    filters.destination_code = { $in: destinations };
  }
  if (req.query.panel_id) {
    const panels = req.query.panel_id.split(",");
    filters.panel_id = { $in: panels };
  }
  if (req.query.framework) {
    filters.framework = req.query.framework;
  }
  if (req.query.country_code) {
    filters.country_code = req.query.country_code.toUpperCase();
  }

  const dataSuccessful = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { ...filters, stage: "successful" } },
      {
        $group: {
          _id: {
            call_year: "$call_year",
            destination_code: "$destination_code",
            destination_name_en: "$destination_name_en",
          },
          total_funding_project: { $sum: "$funding_project" },
          total_involved: { $sum: "$number_involved" },
          total_pi: { $sum: { $cond: [{ $eq: ["$role_entity", "PI"] }, "$number_involved", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          call_year: "$_id.call_year",
          destination_code: "$_id.destination_code",
          destination_name_en: "$_id.destination_name_en",
          total_funding_project: 1,
          total_involved: 1,
          total_pi: 1,
        },
      },
      { $sort: { call_year: 1, destination_code: 1 } },
    ])
    .toArray();

  const dataEvaluated = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { ...filters, stage: "evaluated" } },
      {
        $group: {
          _id: {
            call_year: "$call_year",
            destination_code: "$destination_code",
            destination_name_en: "$destination_name_en",
          },
          total_funding_project: { $sum: "$funding_project" },
          total_involved: { $sum: "$number_involved" },
          total_pi: { $sum: { $cond: [{ $eq: ["$role_entity", "PI"] }, "$number_involved", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          call_year: "$_id.call_year",
          destination_code: "$_id.destination_code",
          destination_name_en: "$_id.destination_name_en",
          total_funding_project: 1,
          total_involved: 1,
          total_pi: 1,
        },
      },
      { $sort: { call_year: 1, destination_code: 1 } },
    ])
    .toArray();

  res.json({
    successful: dataSuccessful,
    evaluated: dataEvaluated,
  });
});

/**
 * Route pour récupérer les filtres disponibles (années, destinations, panels)
 */
router.route("/european-projects/erc/filters").get(async (req, res) => {
  const [years, destinations, panels, frameworks] = await Promise.all([
    db.collection(COLLECTION_NAME).distinct("call_year"),
    db
      .collection(COLLECTION_NAME)
      .aggregate([
        { $group: { _id: { code: "$destination_code", name: "$destination_name_en" } } },
        { $project: { _id: 0, code: "$_id.code", name: "$_id.name" } },
        { $sort: { code: 1 } },
      ])
      .toArray(),
    db
      .collection(COLLECTION_NAME)
      .aggregate([
        {
          $group: {
            _id: {
              id: "$panel_id",
              name: "$panel_name",
              lib: "$panel_lib",
              domaine: "$domaine_scientifique",
              domaine_name: "$domaine_name_scientifique",
            },
          },
        },
        { $project: { _id: 0, id: "$_id.id", name: "$_id.name", lib: "$_id.lib", domaine: "$_id.domaine", domaine_name: "$_id.domaine_name" } },
        { $sort: { domaine: 1, id: 1 } },
      ])
      .toArray(),
    db.collection(COLLECTION_NAME).distinct("framework"),
  ]);

  res.json({
    years: years.sort(),
    destinations,
    panels,
    frameworks,
  });
});

export default router;
