import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-gender-comparison", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-fields-gender-comparison");
    const { annee, discipline_code } = req.query;

    const selectedYear =
      annee ||
      (
        await collection
          .aggregate([
            { $sort: { academic_year: -1 } },
            { $limit: 1 },
            { $project: { academic_year: 1, _id: 0 } },
          ])
          .toArray()
      )?.[0]?.academic_year;

    if (!selectedYear) {
      return res.status(404).json({ error: "Aucune donnée disponible" });
    }

    const disciplinesPipeline = [
      { $match: { academic_year: selectedYear } },
      {
        $project: {
          _id: 0,
          academic_year: 1,
          discipline: 1,
          total_count: 1,
          femmes: {
            total_count: "$femmes.total_count",
            percent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$femmes.total_count", "$total_count"] },
                    100,
                  ],
                },
                1,
              ],
            },
            titulaires_count: "$femmes.titulaires_count",
            titulaires_percent: "$femmes.titulaires_percent",
            enseignants_chercheurs_count:
              "$femmes.enseignants_chercheurs_count",
            enseignants_chercheurs_percent:
              "$femmes.enseignants_chercheurs_percent",
            ec_titulaires_count: "$femmes.ec_titulaires_count",
            ec_titulaires_percent: "$femmes.ec_titulaires_percent",
            quotite_distribution: "$femmes.quotite_distribution",
            age_distribution: "$femmes.age_distribution",
            categorie_distribution: "$femmes.categorie_distribution",
          },
          hommes: {
            total_count: "$hommes.total_count",
            percent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$hommes.total_count", "$total_count"] },
                    100,
                  ],
                },
                1,
              ],
            },
            titulaires_count: "$hommes.titulaires_count",
            titulaires_percent: "$hommes.titulaires_percent",
            enseignants_chercheurs_count:
              "$hommes.enseignants_chercheurs_count",
            enseignants_chercheurs_percent:
              "$hommes.enseignants_chercheurs_percent",
            ec_titulaires_count: "$hommes.ec_titulaires_count",
            ec_titulaires_percent: "$hommes.ec_titulaires_percent",
            quotite_distribution: "$hommes.quotite_distribution",
            age_distribution: "$hommes.age_distribution",
            categorie_distribution: "$hommes.categorie_distribution",
          },
          gender_gap: 1,
        },
      },
      { $sort: { "discipline.label": 1 } },
    ];

    const disciplines = await collection
      .aggregate(disciplinesPipeline)
      .toArray();

    const calculateAgeDistribution = (disciplines, gender) => {
      const ageCategories = [
        "35 ans et moins",
        "36 à 55 ans",
        "56 ans et plus",
      ];

      const distribution = {};

      ageCategories.forEach((category) => {
        let totalCount = 0;
        disciplines.forEach((disc) => {
          if (disc[gender]?.age_distribution?.[category]) {
            totalCount += disc[gender].age_distribution[category].count;
          }
        });

        const totalGenderCount = disciplines.reduce(
          (sum, disc) => sum + (disc[gender]?.total_count || 0),
          0
        );

        const percent =
          totalGenderCount > 0
            ? Math.round((totalCount / totalGenderCount) * 100 * 10) / 10
            : 0;

        distribution[category] = {
          count: totalCount,
          percent: percent,
        };
      });

      return distribution;
    };

    const globalPipeline = [
      { $match: { academic_year: selectedYear } },
      {
        $group: {
          _id: "$academic_year",
          total_count: { $sum: "$total_count" },

          femmes_total: { $sum: "$femmes.total_count" },
          femmes_titulaires: { $sum: "$femmes.titulaires_count" },
          femmes_ec: { $sum: "$femmes.enseignants_chercheurs_count" },
          femmes_ec_titulaires: { $sum: "$femmes.ec_titulaires_count" },

          hommes_total: { $sum: "$hommes.total_count" },
          hommes_titulaires: { $sum: "$hommes.titulaires_count" },
          hommes_ec: { $sum: "$hommes.enseignants_chercheurs_count" },
          hommes_ec_titulaires: { $sum: "$hommes.ec_titulaires_count" },

          femmes_quotite_temps_plein: {
            $sum: {
              $ifNull: ["$femmes.quotite_distribution.Temps plein.count", 0],
            },
          },
          hommes_quotite_temps_plein: {
            $sum: {
              $ifNull: ["$hommes.quotite_distribution.Temps plein.count", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          academic_year: "$_id",
          discipline: { code: "ALL", label: "Toutes disciplines" },
          total_count: 1,
          femmes: {
            total_count: "$femmes_total",
            percent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$femmes_total", "$total_count"] },
                    100,
                  ],
                },
                1,
              ],
            },
            titulaires_count: "$femmes_titulaires",
            titulaires_percent: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$femmes_titulaires",
                        { $max: ["$femmes_total", 1] },
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
            enseignants_chercheurs_count: "$femmes_ec",
            enseignants_chercheurs_percent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$femmes_ec", { $max: ["$femmes_total", 1] }] },
                    100,
                  ],
                },
                1,
              ],
            },
            ec_titulaires_count: "$femmes_ec_titulaires",
            ec_titulaires_percent: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$femmes_ec_titulaires",
                        { $max: ["$femmes_total", 1] },
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
            quotite_distribution: {
              "Temps plein": {
                count: "$femmes_quotite_temps_plein",
                percent: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$femmes_quotite_temps_plein",
                            { $max: ["$femmes_total", 1] },
                          ],
                        },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              },
            },
          },
          hommes: {
            total_count: "$hommes_total",
            percent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$hommes_total", "$total_count"] },
                    100,
                  ],
                },
                1,
              ],
            },
            titulaires_count: "$hommes_titulaires",
            titulaires_percent: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$hommes_titulaires",
                        { $max: ["$hommes_total", 1] },
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
            enseignants_chercheurs_count: "$hommes_ec",
            enseignants_chercheurs_percent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$hommes_ec", { $max: ["$hommes_total", 1] }] },
                    100,
                  ],
                },
                1,
              ],
            },
            ec_titulaires_count: "$hommes_ec_titulaires",
            ec_titulaires_percent: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$hommes_ec_titulaires",
                        { $max: ["$hommes_total", 1] },
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
            quotite_distribution: {
              "Temps plein": {
                count: "$hommes_quotite_temps_plein",
                percent: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$hommes_quotite_temps_plein",
                            { $max: ["$hommes_total", 1] },
                          ],
                        },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              },
            },
          },
          gender_gap: {
            total_percent: {
              $round: [
                {
                  $subtract: [
                    {
                      $multiply: [
                        { $divide: ["$hommes_total", "$total_count"] },
                        100,
                      ],
                    },
                    {
                      $multiply: [
                        { $divide: ["$femmes_total", "$total_count"] },
                        100,
                      ],
                    },
                  ],
                },
                1,
              ],
            },
            titulaires_gap: {
              $round: [
                {
                  $subtract: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$hommes_titulaires",
                            { $max: ["$hommes_total", 1] },
                          ],
                        },
                        100,
                      ],
                    },
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$femmes_titulaires",
                            { $max: ["$femmes_total", 1] },
                          ],
                        },
                        100,
                      ],
                    },
                  ],
                },
                1,
              ],
            },
            quotite_temps_plein_gap: {
              $round: [
                {
                  $subtract: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$hommes_quotite_temps_plein",
                            { $max: ["$hommes_total", 1] },
                          ],
                        },
                        100,
                      ],
                    },
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$femmes_quotite_temps_plein",
                            { $max: ["$femmes_total", 1] },
                          ],
                        },
                        100,
                      ],
                    },
                  ],
                },
                1,
              ],
            },
          },
        },
      },
    ];

    const globalData = await collection.aggregate(globalPipeline).toArray();

    if (globalData.length > 0) {
      const femmes_age_distribution = calculateAgeDistribution(
        disciplines,
        "femmes"
      );
      const hommes_age_distribution = calculateAgeDistribution(
        disciplines,
        "hommes"
      );

      globalData[0].femmes.age_distribution = femmes_age_distribution;
      globalData[0].hommes.age_distribution = hommes_age_distribution;
    }

    if (discipline_code) {
      const disciplineData = disciplines.find(
        (d) => d.discipline.code === discipline_code
      );

      if (!disciplineData) {
        return res.status(404).json({ error: "Discipline non trouvée" });
      }

      const response = {
        ...disciplineData,
        allDisciplines: disciplines,
      };

      return res.json(response);
    } else {
      const response = {
        ...globalData[0],
        allDisciplines: disciplines,
      };

      return res.json(response);
    }
  } catch (err) {
    console.error("Erreur dans /faculty-members-gender-comparison:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

export default router;
