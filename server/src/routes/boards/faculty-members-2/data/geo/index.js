import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/regions", async (req, res) => {
  try {
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const regions = await collection
      .aggregate([
        {
          $group: {
            _id: {
              id: "$etablissement_code_region",
              lib: "$etablissement_region",
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            lib: "$_id.lib",
          },
        },
        {
          $match: {
            id: { $ne: null },
            lib: { $ne: null },
          },
        },
        {
          $sort: { lib: 1 },
        },
      ])
      .toArray();

    res.json({
      regions: regions,
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({
      error: "Server error while fetching regions",
    });
  }
});

router.get("/faculty-members/geo/overview", async (req, res) => {
  try {
    const { year, geo_id } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const matchStage = {};
    if (year) matchStage.annee_universitaire = year;
    if (geo_id) matchStage.etablissement_code_region = geo_id;

    // Le genre par region
    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$sexe",
            count: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    // La catégorie personnelle par region
    const personnalCategoryDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$categorie_personnels",
            count: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    // L'âge par region
    const ageDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$classe_age3",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // Le nombre d'enseignants chercheur par discipline
    const quotiteDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$quotite",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const discipline_distribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              discipline_code: "$code_grande_discipline",
              discipline_name: "$grande_discipline",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
            },
            total_count: { $sum: "$count" },
            gender_breakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    // Le nombre d'enseignants titulaire par region
    const permanentDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$is_titulaire",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    let contextInfo = null;
    if (geo_id) {
      const regionInfo = await collection.findOne(
        { etablissement_code_region: geo_id },
        {
          projection: {
            etablissement_region: 1,
            etablissement_code_region: 1,
          },
        }
      );

      if (regionInfo) {
        contextInfo = {
          id: regionInfo.etablissement_code_region,
          name: regionInfo.etablissement_region,
          type: "region",
        };
      }
    }

    // Le nombre d'enseignants chercheur par region
    const researcherDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$is_enseignant_chercheur",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Total
    const totalCount = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    const regionStatusDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: "$etablissement_code_region",
              geo_name: "$etablissement_region",
              status: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$is_enseignant_chercheur", true] },
                      then: "enseignant_chercheur",
                    },
                    {
                      case: {
                        $and: [
                          { $eq: ["$is_titulaire", true] },
                          { $eq: ["$is_enseignant_chercheur", false] },
                        ],
                      },
                      then: "titulaire_non_chercheur",
                    },
                    {
                      case: { $eq: ["$is_titulaire", false] },
                      then: "non_titulaire",
                    },
                  ],
                  default: "non_titulaire",
                },
              },
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
            },
            total_count: { $sum: "$count" },
            status_breakdown: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    const regionGenderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: "$etablissement_code_region",
              geo_name: "$etablissement_region",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
            },
            total_count: { $sum: "$count" },
            gender_breakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    res.json({
      context_info: contextInfo,
      gender_distribution: genderDistribution,
      age_distribution: ageDistribution,
      regionGenderDistribution: regionGenderDistribution,
      regionStatusDistribution: regionStatusDistribution,
      discipline_distribution: discipline_distribution,
      permanentDistribution: permanentDistribution,
      quotiteDistribution: quotiteDistribution,
      personnalCategoryDistribution: personnalCategoryDistribution,
      researcherDistribution: researcherDistribution,
      total_count: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching geo overview:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Dans /geo/cnu-analysis, remplacer la logique par :
router.get("/faculty-members/geo/cnu-analysis", async (req, res) => {
  try {
    const { year, geo_id } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    let matchStage = {};
    if (year && year !== "all") {
      matchStage.annee_universitaire = year;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
    }

    const cnuGroupsWithSections = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              // CORRECTION : Grouper d'abord par DISCIPLINE
              discipline_code: "$code_grande_discipline",
              discipline_name: "$grande_discipline",
              group_code: "$code_groupe_cnu",
              group_name: "$groupe_cnu",
              section_code: "$code_section_cnu",
              section_name: "$section_cnu",
              gender: "$sexe",
              age_range: "$classe_age3",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
              section_code: "$_id.section_code",
              section_name: "$_id.section_name",
            },
            details: {
              $push: {
                gender: "$_id.gender",
                age_range: "$_id.age_range",
                count: "$count",
              },
            },
            section_total: { $sum: "$count" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
            },
            sections: {
              $push: {
                section_code: "$_id.section_code",
                section_name: "$_id.section_name",
                section_total: "$section_total",
                details: "$details",
              },
            },
            group_total: { $sum: "$section_total" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
            },
            groups: {
              $push: {
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
                group_total: "$group_total",
                sections: "$sections",
              },
            },
            discipline_total: { $sum: "$group_total" },
          },
        },
        { $sort: { discipline_total: -1 } },
      ])
      .toArray();

    res.json({
      cnu_groups_with_sections: cnuGroupsWithSections,
      year: year || "current",
      geo_id: geo_id || null,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données CNU geo:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des données CNU geo",
      error: error.message,
    });
  }
});
router.get("/faculty-members/geo/map-data", async (req, res) => {
  try {
    const { year } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const matchStage = {};
    if (year) matchStage.annee_universitaire = year;

    // Données optimisées pour la carte : agrégation par région avec totaux et répartition par genre
    const mapData = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              region_code: "$etablissement_code_region",
              region_name: "$etablissement_region",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              region_code: "$_id.region_code",
              region_name: "$_id.region_name",
            },
            total_count: { $sum: "$count" },
            gender_breakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },
        {
          $match: {
            "_id.region_code": { $ne: null },
            "_id.region_name": { $ne: null },
          },
        },
        {
          $project: {
            _id: 0,
            geo_id: "$_id.region_code",
            geo_nom: "$_id.region_name",
            total_count: 1,
            gender_breakdown: 1,
            male_count: {
              $reduce: {
                input: "$gender_breakdown",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$this.gender", "Masculin"] },
                    { $add: ["$$value", "$$this.count"] },
                    "$$value",
                  ],
                },
              },
            },
            female_count: {
              $reduce: {
                input: "$gender_breakdown",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$this.gender", "Féminin"] },
                    { $add: ["$$value", "$$this.count"] },
                    "$$value",
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            male_percent: {
              $cond: [
                { $gt: ["$total_count", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$male_count", "$total_count"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
                0,
              ],
            },
            female_percent: {
              $cond: [
                { $gt: ["$total_count", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$female_count", "$total_count"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
                0,
              ],
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    // Statistiques globales pour la légende de la carte
    const globalStats = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total_count: { $sum: "$effectif" },
            max_region_count: { $max: "$effectif" },
            min_region_count: { $min: "$effectif" },
          },
        },
      ])
      .toArray();

    // Calculer les percentiles pour la légende
    const regionCounts = mapData
      .map((region) => region.total_count)
      .sort((a, b) => b - a);
    const stats = {
      total_count: globalStats[0]?.total_count || 0,
      max_region_count: Math.max(...regionCounts),
      min_region_count: Math.min(...regionCounts),
      p75: regionCounts[Math.floor(regionCounts.length * 0.25)] || 0,
      p50: regionCounts[Math.floor(regionCounts.length * 0.5)] || 0,
      p25: regionCounts[Math.floor(regionCounts.length * 0.75)] || 0,
      regions_count: regionCounts.length,
    };

    res.json({
      regions: mapData,
      statistics: stats,
      year: year || "Toutes les années",
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    res.status(500).json({
      error: "Server error while fetching map data",
      details: error.message,
    });
  }
});

export default router;
