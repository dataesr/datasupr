import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();
router.get("/faculty-members/filters/years", async (req, res) => {
  try {
    const { structure_id, field_id, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const allYears = await collection.distinct("annee_universitaire");

    const sortedYears = allYears.filter(Boolean).sort((a, b) => {
      const yearA = parseInt(a.split("-")[0]);
      const yearB = parseInt(b.split("-")[0]);
      return yearB - yearA;
    });

    if (structure_id) {
      const etablissementInfo = await collection.findOne(
        { etablissement_id_paysage: structure_id },
        {
          projection: {
            etablissement_status: 1,
            etablissement_fermeture: 1,
            etablissement_lib: 1,
          },
        }
      );

      let fermetureDate = null;
      let fermetureYear = null;
      if (
        etablissementInfo &&
        etablissementInfo.etablissement_status === "inactive" &&
        etablissementInfo.etablissement_fermeture
      ) {
        fermetureDate = new Date(etablissementInfo.etablissement_fermeture);
        fermetureYear = fermetureDate.getFullYear();
      }

      const baseFilter = { etablissement_id_paysage: structure_id };

      const availableYears = [];
      const completeYears = [];

      for (const year of sortedYears) {
        const yearStart = parseInt(year.split("-")[0]);

        if (fermetureYear && yearStart > fermetureYear) {
          continue;
        }

        const aggregationResult = await collection
          .aggregate([
            {
              $match: {
                annee_universitaire: year,
                etablissement_id_paysage: structure_id,
              },
            },
            {
              $group: {
                _id: null,
                totalEffectif: { $sum: "$effectif" },
              },
            },
          ])
          .toArray();

        const totalEffectif =
          aggregationResult.length > 0 ? aggregationResult[0].totalEffectif : 0;

        if (totalEffectif > 0) {
          availableYears.push(year);

          const nonPermanentCount = await collection.countDocuments({
            annee_universitaire: year,
            etablissement_id_paysage: structure_id,
            is_titulaire: false,
          });

          if (nonPermanentCount > 0) {
            completeYears.push(year);
          }
        }
      }

      const lastCompleteYear =
        completeYears.length > 0
          ? completeYears[0]
          : availableYears.length > 0
          ? availableYears[0]
          : null;
      const lastAvailableYear =
        availableYears.length > 0 ? availableYears[0] : null;

      return res.json({
        academic_years: sortedYears,
        available_years: availableYears,
        complete_years: completeYears,
        last_complete_year: lastCompleteYear,
        last_available_year: lastAvailableYear,
        context: {
          structure_id,
          has_closure_date: fermetureDate !== null,
          closure_date: fermetureDate
            ? fermetureDate.toISOString().split("T")[0]
            : null,
          closure_year: fermetureYear,
        },
      });
    } else {
      const baseFilter = {};

      if (field_id) {
        baseFilter.code_grande_discipline = field_id;
      } else if (geo_id) {
        if (geo_id.toString().startsWith("A")) {
          baseFilter.etablissement_code_academie = geo_id;
        } else {
          baseFilter.etablissement_code_region = geo_id;
        }
      }

      const availableYears = [];
      const completeYears = [];

      for (const year of sortedYears) {
        const yearFilter = {
          ...baseFilter,
          annee_universitaire: year,
        };

        const aggregationResult = await collection
          .aggregate([
            { $match: yearFilter },
            {
              $group: {
                _id: null,
                totalEffectif: { $sum: "$effectif" },
              },
            },
          ])
          .toArray();

        const totalEffectif =
          aggregationResult.length > 0 ? aggregationResult[0].totalEffectif : 0;

        if (totalEffectif > 0) {
          availableYears.push(year);

          const nonPermanentCount = await collection.countDocuments({
            ...yearFilter,
            is_titulaire: false,
          });

          if (nonPermanentCount > 0) {
            completeYears.push(year);
          }
        }
      }

      const lastCompleteYear =
        completeYears.length > 0
          ? completeYears[0]
          : availableYears.length > 0
          ? availableYears[0]
          : null;
      const lastAvailableYear =
        availableYears.length > 0 ? availableYears[0] : null;

      return res.json({
        academic_years: sortedYears,
        available_years: availableYears,
        complete_years: completeYears,
        last_complete_year: lastCompleteYear,
        last_available_year: lastAvailableYear,
        context: {
          field_id,
          geo_id,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({
      error: "Server error while fetching filters",
      details: error.message,
    });
  }
});

router.get("/faculty-members/typology/:context", async (req, res) => {
  try {
    const { context } = req.params;
    const { annee_universitaire, field_id, geo_id, structure_id } = req.query;

    if (!["fields", "geo", "structures"].includes(context)) {
      return res.status(400).json({
        error: "Contexte invalide. Utilisez 'fields', 'geo', ou 'structures'",
      });
    }

    const collection = db.collection("faculty-members_main_staging");

    let contextFilter = {};
    let contextId = null;
    let groupFields = {};
    let itemName = "";

    const isAcademie = geo_id && geo_id.toString().startsWith("A");

    switch (context) {
      case "fields":
        contextId = field_id;
        if (field_id) {
          contextFilter.code_grande_discipline = field_id;
        }
        groupFields = {
          item_code: "$code_grande_discipline",
          item_name: "$grande_discipline",
        };
        itemName = "discipline";
        break;

      case "geo":
        contextId = geo_id;
        if (geo_id) {
          if (isAcademie) {
            contextFilter.etablissement_code_academie = geo_id;
            groupFields = {
              item_code: "$etablissement_code_academie",
              item_name: "$etablissement_academie",
              region_code: "$etablissement_code_region",
              region_name: "$etablissement_region",
            };
            itemName = "academie";
          } else {
            contextFilter.etablissement_code_region = geo_id;
            groupFields = {
              item_code: "$etablissement_code_region",
              item_name: "$etablissement_region",
            };
            itemName = "region";
          }
        } else {
          // Par défaut, regrouper par région si aucun geo_id n'est spécifié
          groupFields = {
            item_code: "$etablissement_code_region",
            item_name: "$etablissement_region",
          };
          itemName = "region";
        }
        break;

      case "structures":
        contextId = structure_id;
        if (structure_id) {
          contextFilter.etablissement_id_paysage = structure_id;
        }
        groupFields = {
          item_code: "$etablissement_id_paysage",
          item_name: "$etablissement_lib",
        };
        itemName = "structure";
        break;
    }

    const pipeline = [
      ...(annee_universitaire
        ? [{ $match: { annee_universitaire: annee_universitaire } }]
        : []),

      ...(Object.keys(contextFilter).length > 0
        ? [{ $match: contextFilter }]
        : []),

      {
        $group: {
          _id: {
            ...groupFields,
            gender: "$sexe",
          },
          total_count: { $sum: "$effectif" },
          titulaires_count: {
            $sum: {
              $cond: [{ $eq: ["$is_titulaire", true] }, "$effectif", 0],
            },
          },
          enseignants_chercheurs_count: {
            $sum: {
              $cond: [
                { $eq: ["$is_enseignant_chercheur", true] },
                "$effectif",
                0,
              ],
            },
          },
          temps_plein_count: {
            $sum: {
              $cond: [{ $eq: ["$quotite", "Temps plein"] }, "$effectif", 0],
            },
          },
          age_35_moins: {
            $sum: {
              $cond: [
                { $eq: ["$classe_age3", "35 ans et moins"] },
                "$effectif",
                0,
              ],
            },
          },
          age_36_55: {
            $sum: {
              $cond: [{ $eq: ["$classe_age3", "36 à 55 ans"] }, "$effectif", 0],
            },
          },
          age_56_plus: {
            $sum: {
              $cond: [
                { $eq: ["$classe_age3", "56 ans et plus"] },
                "$effectif",
                0,
              ],
            },
          },
        },
      },

      {
        $group: {
          _id: {
            item_code: "$_id.item_code",
            item_name: "$_id.item_name",
            ...(isAcademie && {
              region_code: "$_id.region_code",
              region_name: "$_id.region_name",
            }),
          },
          total_count: { $sum: "$total_count" },
          gender_breakdown: {
            $push: {
              gender: "$_id.gender",
              count: "$total_count",
              titulaires_count: "$titulaires_count",
              titulaires_percent: {
                $cond: [
                  { $eq: ["$total_count", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$titulaires_count", "$total_count"] },
                      100,
                    ],
                  },
                ],
              },
              enseignants_chercheurs_count: "$enseignants_chercheurs_count",
              enseignants_chercheurs_percent: {
                $cond: [
                  { $eq: ["$total_count", 0] },
                  0,
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$enseignants_chercheurs_count",
                          "$total_count",
                        ],
                      },
                      100,
                    ],
                  },
                ],
              },
              temps_plein_count: "$temps_plein_count",
              temps_plein_percent: {
                $cond: [
                  { $eq: ["$total_count", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$temps_plein_count", "$total_count"] },
                      100,
                    ],
                  },
                ],
              },
              age_distribution: {
                "35 ans et moins": {
                  count: "$age_35_moins",
                  percent: {
                    $cond: [
                      { $eq: ["$total_count", 0] },
                      0,
                      {
                        $multiply: [
                          { $divide: ["$age_35_moins", "$total_count"] },
                          100,
                        ],
                      },
                    ],
                  },
                },
                "36 à 55 ans": {
                  count: "$age_36_55",
                  percent: {
                    $cond: [
                      { $eq: ["$total_count", 0] },
                      0,
                      {
                        $multiply: [
                          { $divide: ["$age_36_55", "$total_count"] },
                          100,
                        ],
                      },
                    ],
                  },
                },
                "56 ans et plus": {
                  count: "$age_56_plus",
                  percent: {
                    $cond: [
                      { $eq: ["$total_count", 0] },
                      0,
                      {
                        $multiply: [
                          { $divide: ["$age_56_plus", "$total_count"] },
                          100,
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },

      { $sort: { total_count: -1 } },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    if (!contextId && results.length > 0) {
      const globalStats = {
        total_items: results.length,
        items: results,
        context,
        item_type: itemName,
        geo_type:
          context === "geo" ? (isAcademie ? "academie" : "region") : undefined,
        global_summary: {
          total_count: results.reduce((sum, d) => sum + d.total_count, 0),
          total_male: results.reduce((sum, d) => {
            const maleData = d.gender_breakdown.find(
              (g) => g.gender === "Masculin"
            );
            return sum + (maleData ? maleData.count : 0);
          }, 0),
          total_female: results.reduce((sum, d) => {
            const femaleData = d.gender_breakdown.find(
              (g) => g.gender === "Féminin"
            );
            return sum + (femaleData ? femaleData.count : 0);
          }, 0),
        },
      };

      res.json(globalStats);
    } else {
      res.json({
        [itemName]: results[0] || null,
        context,
        item_type: itemName,
        geo_type:
          context === "geo" ? (isAcademie ? "academie" : "region") : undefined,
        annee_universitaire: annee_universitaire || "current",
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de typologie:",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des données de typologie",
      error: error.message,
    });
  }
});

router.get("/faculty-members/navigation/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { annee_universitaire } = req.query;

    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    // Pour les structures, on ne filtre pas par année car on veut toutes les structures à discuter avec les boss
    if (annee_universitaire && type !== "structures")
      matchStage.annee_universitaire = annee_universitaire;

    let aggregation = [];

    switch (type) {
      case "fields":
        aggregation = [
          { $match: matchStage },
          {
            $group: {
              _id: {
                discipline_code: "$code_grande_discipline",
                discipline_name: "$grande_discipline",
              },
              total_count: { $sum: "$effectif" },
            },
          },
          {
            $match: {
              "_id.discipline_code": { $ne: null, $ne: "" },
              "_id.discipline_name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.discipline_code",
              name: "$_id.discipline_name",
              total_count: 1,
            },
          },
          { $sort: { total_count: -1 } },
        ];
        break;

      case "academies":
        aggregation = [
          { $match: matchStage },
          {
            $group: {
              _id: {
                academie_code: "$etablissement_code_academie",
                academie_name: "$etablissement_academie",
              },
              total_count: { $sum: "$effectif" },
            },
          },
          {
            $match: {
              "_id.academie_code": { $ne: null, $ne: "" },
              "_id.academie_name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.academie_code",
              name: "$_id.academie_name",
              total_count: 1,
            },
          },
          { $sort: { total_count: -1 } },
        ];
        break;

      case "regions":
        aggregation = [
          { $match: matchStage },
          {
            $group: {
              _id: {
                region_code: "$etablissement_code_region",
                region_name: "$etablissement_region",
              },
              total_count: { $sum: "$effectif" },
            },
          },
          {
            $match: {
              "_id.region_code": { $ne: null, $ne: "" },
              "_id.region_name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.region_code",
              name: "$_id.region_name",
              total_count: 1,
            },
          },
          { $sort: { total_count: -1 } },
        ];
        break;

      case "structures":
        aggregation = [
          {
            $group: {
              _id: {
                structure_id: "$etablissement_id_paysage",
                structure_name: "$etablissement_lib",
                structure_type: "$etablissement_type",
                region_name: "$etablissement_region",
                status: "$etablissement_status",
              },
              total_count: { $sum: "$effectif" },
              latest_year: { $max: "$annee_universitaire" },
            },
          },
          {
            $match: {
              "_id.structure_id": { $ne: null, $ne: "" },
              "_id.structure_name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.structure_id",
              name: "$_id.structure_name",
              type: "$_id.structure_type",
              region: "$_id.region_name",
              status: "$_id.status",
              is_active: { $eq: ["$_id.status", "active"] },
              total_count: 1,
              latest_year: 1,
            },
          },
          { $sort: { total_count: -1 } },
        ];
        break;

      default:
        return res.status(400).json({
          error: "Type invalide. Utilisez 'fields', 'regions', ou 'structures'",
        });
    }

    const items = await collection.aggregate(aggregation).toArray();

    res.json({
      type,
      annee_universitaire: annee_universitaire || "Toutes les années",
      items,
      total_items: items.length,
    });
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message,
    });
  }
});

router.get("/faculty-members/search-bar", async (req, res) => {
  try {
    const { limit = 200 } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const latestYear = await collection.distinct("annee_universitaire").then(
      (years) =>
        years.filter(Boolean).sort((a, b) => {
          const yearA = parseInt(a.split("-")[0]);
          const yearB = parseInt(b.split("-")[0]);
          return yearB - yearA;
        })[0]
    );

    const [universities, regions, academies, fields] = await Promise.all([
      collection
        .aggregate([
          { $match: { annee_universitaire: latestYear } },
          {
            $group: {
              _id: {
                id: "$etablissement_id_paysage_actuel",
                name: "$etablissement_actuel_lib",
                type: "$etablissement_type",
                region: "$etablissement_region",
              },
              total_count: { $sum: "$effectif" },
            },
          },
          {
            $match: {
              "_id.id": { $ne: null, $ne: "" },
              "_id.name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.id",
              name: "$_id.name",
              type: "univ",
              subtype: "$_id.type",
              region: "$_id.region",
              total_count: 1,
              href: {
                $concat: [
                  "/personnel-enseignant/universite/vue-d'ensemble?structure_id=",
                  "$_id.id",
                  "&annee_universitaire=",
                  latestYear,
                ],
              },
            },
          },
          { $sort: { total_count: -1 } },
          { $limit: parseInt(limit) },
        ])
        .toArray(),

      // Régions
      collection
        .aggregate([
          { $match: { annee_universitaire: latestYear } },
          {
            $group: {
              _id: {
                id: "$etablissement_code_region",
                name: "$etablissement_region",
              },
              total_count: { $sum: "$effectif" },
            },
          },
          {
            $match: {
              "_id.id": { $ne: null, $ne: "" },
              "_id.name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.id",
              name: "$_id.name",
              type: "region",
              total_count: 1,
              href: {
                $concat: [
                  "/personnel-enseignant/geo/vue-d'ensemble?geo_id=",
                  "$_id.id",
                  "&annee_universitaire=",
                  latestYear,
                ],
              },
            },
          },
          { $sort: { total_count: -1 } },
        ])
        .toArray(),

      // Académies
      collection
        .aggregate([
          { $match: { annee_universitaire: latestYear } },
          {
            $group: {
              _id: {
                id: "$etablissement_code_academie",
                name: "$etablissement_academie",
                region_id: "$etablissement_code_region",
                region_name: "$etablissement_region",
              },
              total_count: { $sum: "$effectif" },
            },
          },
          {
            $match: {
              "_id.id": { $ne: null, $ne: "" },
              "_id.name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.id",
              name: "$_id.name",
              type: "academie",
              region_id: "$_id.region_id",
              region_name: "$_id.region_name",
              total_count: 1,
              href: {
                $concat: [
                  "/personnel-enseignant/geo/vue-d'ensemble?geo_id=",
                  "$_id.id",
                  "&annee_universitaire=",
                  latestYear,
                ],
              },
            },
          },
          { $sort: { total_count: -1 } },
        ])
        .toArray(),

      // Disciplines
      collection
        .aggregate([
          { $match: { annee_universitaire: latestYear } },
          {
            $group: {
              _id: {
                id: "$code_grande_discipline",
                name: "$grande_discipline",
              },
              total_count: { $sum: "$effectif" },
            },
          },
          {
            $match: {
              "_id.id": { $ne: null, $ne: "" },
              "_id.name": { $ne: null, $ne: "" },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id.id",
              name: "$_id.name",
              type: "discipline",
              total_count: 1,
              href: {
                $concat: [
                  "/personnel-enseignant/discipline/vue-d'ensemble?field_id=",
                  "$_id.id",
                  "&annee_universitaire=",
                  latestYear,
                ],
              },
            },
          },
          { $sort: { total_count: -1 } },
        ])
        .toArray(),
    ]);

    res.json({
      latest_year: latestYear,
      universities: universities,
      regions: regions,
      academies: academies,
      fields: fields,
      totals: {
        universities: universities.length,
        regions: regions.length,
        academies: academies.length,
        fields: fields.length,
      },
    });
  } catch (error) {
    console.error("Error in searchBar:", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des données",
      details: error.message,
    });
  }
});

router.get("/faculty-members/data-completeness", async (req, res) => {
  try {
    const { annee_universitaire, field_id, geo_id, structure_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    if (!annee_universitaire) {
      return res.status(400).json({
        error: "annee_universitaire is required",
      });
    }

    const matchStage = {
      annee_universitaire: annee_universitaire,
    };

    if (field_id) {
      matchStage.code_grande_discipline = field_id;
    }
    if (structure_id) {
      matchStage.etablissement_id_paysage = structure_id;
    }
    if (geo_id) {
      if (geo_id.toString().startsWith("A")) {
        matchStage.etablissement_code_academie = geo_id;
      } else {
        matchStage.etablissement_code_region = geo_id;
      }
    }

    const nonPermanentCount = await collection.countDocuments({
      ...matchStage,
      is_titulaire: false,
    });

    res.json({
      has_non_permanent_staff: nonPermanentCount > 0,
      non_permanent_count: nonPermanentCount,
      annee_universitaire,
      context: {
        field_id,
        geo_id,
        structure_id,
      },
    });
  } catch (error) {
    console.error("Error checking data completeness:", error);
    res.status(500).json({
      error: "Server error while checking data completeness",
      details: error.message,
    });
  }
});

router.get("/faculty-members/evolution/categories", async (req, res) => {
  try {
    const { context, contextId, start_year, end_year } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {
      is_titulaire: true,
    };

    if (contextId) {
      if (context === "geo") {
        const isAcademie = contextId.toString().startsWith("A");
        if (isAcademie) {
          matchStage.etablissement_code_academie = contextId;
        } else {
          matchStage.etablissement_code_region = contextId;
        }
      } else if (context === "fields") {
        matchStage.code_grande_discipline = contextId;
      } else if (context === "structures") {
        matchStage.$or = [
          { etablissement_id_paysage: contextId },
          { etablissement_id_paysage_actuel: contextId },
        ];
      }
    }

    if (start_year || end_year) {
      matchStage.annee_universitaire = {};
      if (start_year) {
        matchStage.annee_universitaire.$gte = start_year;
      }
      if (end_year) {
        matchStage.annee_universitaire.$lte = end_year;
      }
    }

    const evolutionData = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              category_name: "$categorie_assimilation",
            },
            totalCount: { $sum: "$effectif" },
            maleCount: {
              $sum: { $cond: [{ $eq: ["$sexe", "Masculin"] }, "$effectif", 0] },
            },
            femaleCount: {
              $sum: { $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            annee_universitaire: "$_id.annee_universitaire",
            categoryName: "$_id.category_name",
            totalCount: 1,
            maleCount: 1,
            femaleCount: 1,
          },
        },
        { $sort: { annee_universitaire: 1, categoryName: 1 } },
      ])
      .toArray();

    const formattedEvolutionData = evolutionData.reduce((acc, item) => {
      if (!acc[item.annee_universitaire]) {
        acc[item.annee_universitaire] = [];
      }
      acc[item.annee_universitaire].push({
        categoryName: item.categoryName,
        totalCount: item.totalCount,
        maleCount: item.maleCount,
        femaleCount: item.femaleCount,
      });
      return acc;
    }, {});

    const allYears = [
      ...new Set(evolutionData.map((d) => d.annee_universitaire)),
    ].sort();
    const allCategories = [
      ...new Set(evolutionData.map((d) => d.categoryName)),
    ].filter(Boolean);

    const seriesData = allCategories.map((categoryName) => {
      return {
        name: categoryName,
        data: allYears.map((year) => {
          const yearData = evolutionData.find(
            (d) =>
              d.annee_universitaire === year && d.categoryName === categoryName
          );
          return {
            y: yearData ? yearData.totalCount : 0,
            maleCount: yearData ? yearData.maleCount : 0,
            femaleCount: yearData ? yearData.femaleCount : 0,
            annee_universitaire: year,
          };
        }),
      };
    });

    res.json({
      evolutionByCategories: seriesData,
      academicYears: allYears,
    });
  } catch (error) {
    console.error("Error fetching category evolution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
