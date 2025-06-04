import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-fields-status", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-fields-status");
    const { annee, id } = req.query;

    const pipeline = [];

    if (annee) {
      pipeline.push({ $match: { academic_year: annee } });
    }

    pipeline.push(
      {
        $project: {
          _id: 0,
          year: "$academic_year",
          totalCount: "$total_count",
          disciplines: {
            $map: {
              input: "$disciplines",
              as: "discipline",
              in: {
                field_id: "$$discipline.field_id",
                fieldLabel: "$$discipline.field_label",
                totalCount: "$$discipline.total_count",
                status: {
                  titulaires: {
                    count: "$$discipline.titulaires",
                    percent: "$$discipline.titulaires_percent",
                  },
                  nonTitulaires: {
                    count: "$$discipline.non_titulaires",
                    percent: {
                      $subtract: [100, "$$discipline.titulaires_percent"],
                    },
                  },
                  enseignantsChercheurs: {
                    count: "$$discipline.enseignants_chercheurs",
                    percent: "$$discipline.enseignants_chercheurs_percent",
                  },
                  nonEnseignantsChercheurs: {
                    count: "$$discipline.non_enseignants_chercheurs",
                    percent: {
                      $subtract: [
                        100,
                        "$$discipline.enseignants_chercheurs_percent",
                      ],
                    },
                  },
                  ecTitulaires: {
                    count: "$$discipline.ec_titulaires",
                    percent: {
                      $cond: [
                        { $eq: ["$$discipline.total_count", 0] },
                        0,
                        {
                          $round: [
                            {
                              $multiply: [
                                {
                                  $divide: [
                                    "$$discipline.ec_titulaires",
                                    "$$discipline.total_count",
                                  ],
                                },
                                100,
                              ],
                            },
                            1,
                          ],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          aggregatedStats: {
            totalTitulaires: { $sum: "$disciplines.titulaires" },
            totalEnseignantsChercheurs: {
              $sum: "$disciplines.enseignants_chercheurs",
            },
            totalEcTitulaires: { $sum: "$disciplines.ec_titulaires" },
            totalNonTitulaires: { $sum: "$disciplines.non_titulaires" },
          },
        },
      },
      {
        $addFields: {
          "aggregatedStats.titulairesPercent": {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$aggregatedStats.totalTitulaires",
                      "$totalCount",
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          "aggregatedStats.enseignantsChercheursPercent": {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$aggregatedStats.totalEnseignantsChercheurs",
                      "$totalCount",
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          "aggregatedStats.nonTitulairesPercent": {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$aggregatedStats.totalNonTitulaires",
                      "$totalCount",
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          "aggregatedStats.ecTitulairesPercent": {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$aggregatedStats.totalEcTitulaires",
                      "$totalCount",
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
        },
      }
    );

    if (id) {
      pipeline.push({
        $addFields: {
          disciplines: {
            $filter: {
              input: "$disciplines",
              cond: { $eq: ["$$this.field_id", id] },
            },
          },
        },
      });

      pipeline.push({
        $addFields: {
          totalCount: { $sum: "$disciplines.totalCount" },
          aggregatedStats: {
            totalTitulaires: { $sum: "$disciplines.status.titulaires.count" },
            totalEnseignantsChercheurs: {
              $sum: "$disciplines.status.enseignantsChercheurs.count",
            },
            totalNonTitulaires: {
              $sum: "$disciplines.status.nonTitulaires.count",
            },
            totalEcTitulaires: {
              $sum: "$disciplines.status.ecTitulaires.count",
            },
            titulairesPercent: {
              $cond: [
                { $eq: [{ $sum: "$disciplines.totalCount" }, 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            { $sum: "$disciplines.status.titulaires.count" },
                            { $sum: "$disciplines.totalCount" },
                          ],
                        },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
            enseignantsChercheursPercent: {
              $cond: [
                { $eq: [{ $sum: "$disciplines.totalCount" }, 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $sum: "$disciplines.status.enseignantsChercheurs.count",
                            },
                            { $sum: "$disciplines.totalCount" },
                          ],
                        },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
            nonTitulairesPercent: {
              $cond: [
                { $eq: [{ $sum: "$disciplines.totalCount" }, 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            { $sum: "$disciplines.status.nonTitulaires.count" },
                            { $sum: "$disciplines.totalCount" },
                          ],
                        },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              ],
            },
          },
        },
      });
    }

    pipeline.push({
      $sort: { year: -1 },
    });

    const result = await collection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("Erreur dans /faculty-members-discipline-status:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

export default router;
