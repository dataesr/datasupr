import express from "express";
import { checkQuery, recreateIndex } from "../utils.js";
import { db } from "../../../../services/mongo.js";

const router = new express.Router();

const routesPrefix = "/european-projects/type-beneficiaries";

router.route(routesPrefix + "/top10-countries-by-type-of-beneficiaries").get(async (req, res) => {
  console.log("Fetching top 10 countries by type of beneficiaries with filters:", req.query);
  
  if (!req.query.country_code) {
    return res.status(400).json({ error: "Le code pays est requis" });
  }

  try {
    const filters = { framework: "Horizon Europe" };
    const targetCountry = req.query.country_code.toUpperCase();

    // test filters (thematics, programs, thematics, destinations) - sans country_code
    if (req.query.pillars) {
      const pillars = req.query.pillars.split("|");
      filters.pilier_code = { $in: pillars };
    }
    if (req.query.programs) {
      const programs = req.query.programs.split("|");
      filters.programme_code = { $in: programs };
    }
    if (req.query.thematics) {
      const thematics = req.query.thematics.split("|");
      const filteredThematics = thematics.filter(thematic => !['ERC', 'MSCA'].includes(thematic));
      filters.thema_code = { $in: filteredThematics };
    }
    if (req.query.destinations) {
      const destinations = req.query.destinations.split("|");
      filters.destination_code = { $in: destinations };
    }

    const data = await db
      .collection("ep_projects-entities_staging")
      .aggregate([
        {
          $match: filters,
        },
        {
          $group: {
            _id: {
              country_code: "$country_code",
              country_name_fr: "$country_name_fr",
              country_name_en: "$country_name_en",
              cordis_type_entity_code: "$cordis_type_entity_code",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $group: {
            _id: "$_id.country_code",
            country_name_fr: { $first: "$_id.country_name_fr" },
            country_name_en: { $first: "$_id.country_name_en" },
            types: {
              $push: {
                cordis_type_entity_code: "$_id.cordis_type_entity_code",
                total_fund_eur: "$total_fund_eur"
              }
            },
            total_fund_eur: { $sum: "$total_fund_eur" }
          }
        },
        {
          $project: {
            _id: 0,
            country_code: "$_id",
            country_name_fr: 1,
            country_name_en: 1,
            types: {
              $map: {
                input: {
                  $sortArray: {
                    input: "$types",
                    sortBy: { cordis_type_entity_code: -1 }
                  }
                },
                as: "type",
                in: "$$type"
              }
            },
            total_fund_eur: 1,
          },
        },
        {
          $sort: { total_fund_eur: -1 },
        },
      ])
      .toArray();

    const total = data.reduce((acc, el) => acc + el.total_fund_eur, 0);

    // Logique pour le top 10 avec remplacement
    let resultData = [...data];
    const top10 = resultData.slice(0, 10);
    const targetCountryIndex = resultData.findIndex(item => item.country_code === targetCountry);
    
    if (targetCountryIndex >= 10) {
      // Le pays cible n'est pas dans le top 10, remplacer le 10ème par le pays cible
      const targetCountryData = resultData[targetCountryIndex];
      top10[9] = targetCountryData;
    } else if (targetCountryIndex === -1) {
      // Le pays cible n'existe pas dans les données
      return res.status(404).json({ error: "Aucune donnée trouvée pour ce pays" });
    }

    res.status(200).json({ total_fund_eur: total, data: top10 });
  } catch (error) {
    console.error("Error fetching type by country:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route pour créer l'index pour top10-countries-by-type-of-beneficiaries
router.route(routesPrefix + "/top10-countries-by-type-of-beneficiaries_indexes").get(async (req, res) => {
  try {
    await recreateIndex(
      db.collection("ep_projects-entities_staging"),
      {
        // Champs de filtrage (ordre optimisé pour la sélectivité)
        framework: 1,
        pilier_code: 1,
        programme_code: 1,
        thema_code: 1,
        destination_code: 1,
        // Champs utilisés dans le groupement et la projection
        country_code: 1,
        cordis_type_entity_acro: 1,
        fund_eur: 1
      },
      "idx_top10_countries_by_type_of_beneficiaries_covered"
    );
    
    res.status(201).json({ 
      message: "Index couvert pour top10-countries-by-type-of-beneficiaries créé avec succès",
      indexName: "idx_top10_countries_by_type_of_beneficiaries_covered"
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'index couvert:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'index couvert" });
  }
});

export default router;
