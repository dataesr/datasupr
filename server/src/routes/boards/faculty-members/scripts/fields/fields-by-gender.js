import { MongoClient } from "mongodb";

async function analyzeTeachersGenderComparison() {
  const client = new MongoClient("mongodb://localhost:27017/");

  try {
    await client.connect();
    const db = client.db("datasupr");
    const source = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );
    const targetCollectionName = "teaching-staff-fields-gender-comparison";

    const pipeline = [
      {
        $group: {
          _id: {
            academic_year: "$annee_universitaire",
            sexe: "$sexe",
            discipline_code: "$code_grande_discipline",
            discipline_label: "$grande_discipline",
          },
          total_count: { $sum: "$effectif" },
          titulaires_count: {
            $sum: { $cond: ["$is_titulaire", "$effectif", 0] },
          },
          enseignants_chercheurs_count: {
            $sum: { $cond: ["$is_enseignant_chercheur", "$effectif", 0] },
          },
          ec_titulaires_count: {
            $sum: {
              $cond: [
                { $and: ["$is_titulaire", "$is_enseignant_chercheur"] },
                "$effectif",
                0,
              ],
            },
          },
          age_distribution: {
            $push: {
              $cond: [
                { $ne: ["$classe_age3", null] },
                {
                  k: "$classe_age3",
                  v: "$effectif",
                },
                "$$REMOVE",
              ],
            },
          },
          quotite_distribution: {
            $push: {
              $cond: [
                { $ne: ["$quotite", null] },
                {
                  k: "$quotite",
                  v: "$effectif",
                },
                "$$REMOVE",
              ],
            },
          },
          cnu_distribution: {
            $push: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$code_groupe_cnu", null] },
                    { $ne: ["$code_groupe_cnu", ""] },
                  ],
                },
                {
                  code: "$code_groupe_cnu",
                  label: "$groupe_cnu",
                  count: "$effectif",
                },
                "$$REMOVE",
              ],
            },
          },
          categorie_distribution: {
            $push: {
              $cond: [
                { $ne: ["$categorie_pers_grp", null] },
                {
                  k: "$categorie_pers_grp",
                  v: "$effectif",
                },
                "$$REMOVE",
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          academic_year: "$_id.academic_year",
          sexe: "$_id.sexe",
          discipline: {
            code: "$_id.discipline_code",
            label: "$_id.discipline_label",
          },
          total_count: 1,
          titulaires_count: 1,
          enseignants_chercheurs_count: 1,
          ec_titulaires_count: 1,
          non_titulaires_count: {
            $subtract: ["$total_count", "$titulaires_count"],
          },
          non_ec_count: {
            $subtract: ["$total_count", "$enseignants_chercheurs_count"],
          },

          titulaires_percent: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$titulaires_count",
                      { $max: ["$total_count", 1] },
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          enseignants_chercheurs_percent: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$enseignants_chercheurs_count",
                      { $max: ["$total_count", 1] },
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          ec_titulaires_percent: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$ec_titulaires_count",
                      { $max: ["$total_count", 1] },
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },

          age_distribution: {
            $arrayToObject: {
              $map: {
                input: {
                  $setUnion: {
                    $map: {
                      input: "$age_distribution",
                      as: "age",
                      in: "$$age.k",
                    },
                  },
                },
                as: "age_class",
                in: {
                  k: "$$age_class",
                  v: {
                    count: {
                      $sum: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$age_distribution",
                              as: "a",
                              cond: { $eq: ["$$a.k", "$$age_class"] },
                            },
                          },
                          as: "filtered",
                          in: "$$filtered.v",
                        },
                      },
                    },
                    percent: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $sum: {
                                    $map: {
                                      input: {
                                        $filter: {
                                          input: "$age_distribution",
                                          as: "a",
                                          cond: {
                                            $eq: ["$$a.k", "$$age_class"],
                                          },
                                        },
                                      },
                                      as: "filtered",
                                      in: "$$filtered.v",
                                    },
                                  },
                                },
                                { $max: ["$total_count", 1] },
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
            },
          },

          quotite_distribution: {
            $arrayToObject: {
              $map: {
                input: {
                  $setUnion: {
                    $map: {
                      input: "$quotite_distribution",
                      as: "q",
                      in: "$$q.k",
                    },
                  },
                },
                as: "quotite_type",
                in: {
                  k: "$$quotite_type",
                  v: {
                    count: {
                      $sum: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$quotite_distribution",
                              as: "q",
                              cond: { $eq: ["$$q.k", "$$quotite_type"] },
                            },
                          },
                          as: "filtered",
                          in: "$$filtered.v",
                        },
                      },
                    },
                    percent: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $sum: {
                                    $map: {
                                      input: {
                                        $filter: {
                                          input: "$quotite_distribution",
                                          as: "q",
                                          cond: {
                                            $eq: ["$$q.k", "$$quotite_type"],
                                          },
                                        },
                                      },
                                      as: "filtered",
                                      in: "$$filtered.v",
                                    },
                                  },
                                },
                                { $max: ["$total_count", 1] },
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
            },
          },

          categorie_distribution: {
            $arrayToObject: {
              $map: {
                input: {
                  $setUnion: {
                    $map: {
                      input: "$categorie_distribution",
                      as: "cat",
                      in: "$$cat.k",
                    },
                  },
                },
                as: "categorie",
                in: {
                  k: "$$categorie",
                  v: {
                    count: {
                      $sum: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$categorie_distribution",
                              as: "cat",
                              cond: { $eq: ["$$cat.k", "$$categorie"] },
                            },
                          },
                          as: "filtered",
                          in: "$$filtered.v",
                        },
                      },
                    },
                    percent: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $sum: {
                                    $map: {
                                      input: {
                                        $filter: {
                                          input: "$categorie_distribution",
                                          as: "cat",
                                          cond: {
                                            $eq: ["$$cat.k", "$$categorie"],
                                          },
                                        },
                                      },
                                      as: "filtered",
                                      in: "$$filtered.v",
                                    },
                                  },
                                },
                                { $max: ["$total_count", 1] },
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
            },
          },
        },
      },

      {
        $group: {
          _id: {
            academic_year: "$academic_year",
            discipline_code: "$discipline.code",
          },
          discipline_label: { $first: "$discipline.label" },
          data_by_gender: {
            $push: {
              sexe: "$sexe",
              total_count: "$total_count",
              titulaires_count: "$titulaires_count",
              titulaires_percent: "$titulaires_percent",
              non_titulaires_count: "$non_titulaires_count",
              enseignants_chercheurs_count: "$enseignants_chercheurs_count",
              enseignants_chercheurs_percent: "$enseignants_chercheurs_percent",
              non_ec_count: "$non_ec_count",
              ec_titulaires_count: "$ec_titulaires_count",
              ec_titulaires_percent: "$ec_titulaires_percent",
              age_distribution: "$age_distribution",
              quotite_distribution: "$quotite_distribution",
              categorie_distribution: "$categorie_distribution",
            },
          },
          total_discipline_year: { $sum: "$total_count" },
        },
      },

      {
        $project: {
          _id: 0,
          academic_year: "$_id.academic_year",
          discipline: {
            code: "$_id.discipline_code",
            label: "$discipline_label",
          },
          total_count: "$total_discipline_year",
          femmes: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$data_by_gender",
                  as: "item",
                  cond: { $eq: ["$$item.sexe", "Féminin"] },
                },
              },
              0,
            ],
          },
          hommes: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$data_by_gender",
                  as: "item",
                  cond: { $eq: ["$$item.sexe", "Masculin"] },
                },
              },
              0,
            ],
          },
          gender_gap: {
            total_percent: {
              $round: [
                {
                  $subtract: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $arrayElemAt: [
                                {
                                  $map: {
                                    input: {
                                      $filter: {
                                        input: "$data_by_gender",
                                        as: "item",
                                        cond: {
                                          $eq: ["$$item.sexe", "Masculin"],
                                        },
                                      },
                                    },
                                    as: "m",
                                    in: "$$m.total_count",
                                  },
                                },
                                0,
                              ],
                            },
                            { $max: ["$total_discipline_year", 1] },
                          ],
                        },
                        100,
                      ],
                    },
                    {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $arrayElemAt: [
                                {
                                  $map: {
                                    input: {
                                      $filter: {
                                        input: "$data_by_gender",
                                        as: "item",
                                        cond: {
                                          $eq: ["$$item.sexe", "Féminin"],
                                        },
                                      },
                                    },
                                    as: "f",
                                    in: "$$f.total_count",
                                  },
                                },
                                0,
                              ],
                            },
                            { $max: ["$total_discipline_year", 1] },
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
            titulaires_gap: {
              $round: [
                {
                  $subtract: [
                    {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$data_by_gender",
                                as: "item",
                                cond: { $eq: ["$$item.sexe", "Masculin"] },
                              },
                            },
                            as: "m",
                            in: "$$m.titulaires_percent",
                          },
                        },
                        0,
                      ],
                    },
                    {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$data_by_gender",
                                as: "item",
                                cond: { $eq: ["$$item.sexe", "Féminin"] },
                              },
                            },
                            as: "f",
                            in: "$$f.titulaires_percent",
                          },
                        },
                        0,
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
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$data_by_gender",
                                    as: "item",
                                    cond: { $eq: ["$$item.sexe", "Masculin"] },
                                  },
                                },
                                as: "m",
                                in: {
                                  $ifNull: [
                                    "$$m.quotite_distribution.Temps plein.percent",
                                    0,
                                  ],
                                },
                              },
                            },
                            0,
                          ],
                        },
                        0,
                      ],
                    },
                    {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$data_by_gender",
                                    as: "item",
                                    cond: { $eq: ["$$item.sexe", "Féminin"] },
                                  },
                                },
                                as: "f",
                                in: {
                                  $ifNull: [
                                    "$$f.quotite_distribution.Temps plein.percent",
                                    0,
                                  ],
                                },
                              },
                            },
                            0,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                1,
              ],
            },
          },
          last_updated: { $literal: new Date() },
        },
      },

      {
        $sort: {
          academic_year: 1,
          "discipline.code": 1,
        },
      },

      {
        $merge: {
          into: targetCollectionName,
          whenMatched: "replace",
          whenNotMatched: "insert",
        },
      },
    ];

    const result = await source.aggregate(pipeline).toArray();

    return result;
  } finally {
    await client.close();
  }
}

analyzeTeachersGenderComparison()
  .then(() => {
    console.log("Script exécuté avec succès");
  })
  .catch((err) => {
    console.error("Erreur lors de l'exécution du script:", err);
  });
