import { MongoClient } from "mongodb";

async function createTrendsCollection() {
  const client = new MongoClient("mongodb://localhost:27017/");

  try {
    await client.connect();
    const db = client.db("datasupr");
    const source = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );
    const targetCollectionName = "teaching-staff-trends-by-year";

    const yearsResult = await source.distinct("annee_universitaire");
    const pipeline = [
      {
        $group: {
          _id: {
            academic_year: "$annee_universitaire",
            field_id: "$code_grande_discipline",
            field_label: "$grande_discipline",
            is_titulaire: "$is_titulaire",
            is_enseignant_chercheur: "$is_enseignant_chercheur",
            sexe: "$sexe",
            age_class: "$classe_age3",
          },
          total_count: { $sum: "$effectif" },
        },
      },

      {
        $group: {
          _id: {
            academic_year: "$_id.academic_year",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
            is_titulaire: "$_id.is_titulaire",
            is_enseignant_chercheur: "$_id.is_enseignant_chercheur",
            age_class: "$_id.age_class",
          },
          femmes: {
            $sum: {
              $cond: [{ $eq: ["$_id.sexe", "Féminin"] }, "$total_count", 0],
            },
          },
          hommes: {
            $sum: {
              $cond: [{ $eq: ["$_id.sexe", "Masculin"] }, "$total_count", 0],
            },
          },
          inconnus: {
            $sum: {
              $cond: [
                { $not: { $in: ["$_id.sexe", ["Féminin", "Masculin"]] } },
                "$total_count",
                0,
              ],
            },
          },
        },
      },

      {
        $group: {
          _id: {
            academic_year: "$_id.academic_year",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
          },
          total_count: {
            $sum: { $add: ["$femmes", "$hommes", "$inconnus"] },
          },
          femmes: { $sum: "$femmes" },
          hommes: { $sum: "$hommes" },
          inconnus: { $sum: "$inconnus" },

          enseignants_chercheurs: {
            $sum: {
              $cond: [
                { $eq: ["$_id.is_enseignant_chercheur", true] },
                { $add: ["$femmes", "$hommes", "$inconnus"] },
                0,
              ],
            },
          },
          titulaires: {
            $sum: {
              $cond: [
                { $eq: ["$_id.is_titulaire", true] },
                { $add: ["$femmes", "$hommes", "$inconnus"] },
                0,
              ],
            },
          },
          non_titulaires: {
            $sum: {
              $cond: [
                { $eq: ["$_id.is_titulaire", false] },
                { $add: ["$femmes", "$hommes", "$inconnus"] },
                0,
              ],
            },
          },
          ec_titulaires: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$_id.is_enseignant_chercheur", true] },
                    { $eq: ["$_id.is_titulaire", true] },
                  ],
                },
                { $add: ["$femmes", "$hommes", "$inconnus"] },
                0,
              ],
            },
          },

          age_distribution: {
            $push: {
              age_class: "$_id.age_class",
              total: { $add: ["$femmes", "$hommes", "$inconnus"] },
              femmes: "$femmes",
              hommes: "$hommes",
              inconnus: "$inconnus",
              titulaires: {
                $cond: [
                  { $eq: ["$_id.is_titulaire", true] },
                  { $add: ["$femmes", "$hommes", "$inconnus"] },
                  0,
                ],
              },
              enseignants_chercheurs: {
                $cond: [
                  { $eq: ["$_id.is_enseignant_chercheur", true] },
                  { $add: ["$femmes", "$hommes", "$inconnus"] },
                  0,
                ],
              },
            },
          },
        },
      },

      {
        $group: {
          _id: "$_id.academic_year",
          academic_year: { $first: "$_id.academic_year" },
          total_count: { $sum: "$total_count" },
          femmes: { $sum: "$femmes" },
          hommes: { $sum: "$hommes" },
          inconnus: { $sum: "$inconnus" },
          enseignants_chercheurs: { $sum: "$enseignants_chercheurs" },
          titulaires: { $sum: "$titulaires" },
          non_titulaires: { $sum: "$non_titulaires" },
          ec_titulaires: { $sum: "$ec_titulaires" },

          disciplines: {
            $push: {
              field_id: "$_id.field_id",
              field_label: "$_id.field_label",
              total_count: "$total_count",
              femmes: "$femmes",
              hommes: "$hommes",
              inconnus: "$inconnus",
              enseignants_chercheurs: "$enseignants_chercheurs",
              titulaires: "$titulaires",
              non_titulaires: "$non_titulaires",
              ec_titulaires: "$ec_titulaires",
              age_distribution: "$age_distribution",
            },
          },
        },
      },

      {
        $addFields: {
          femmes_percent: {
            $round: [
              { $multiply: [{ $divide: ["$femmes", "$total_count"] }, 100] },
              1,
            ],
          },
          hommes_percent: {
            $round: [
              { $multiply: [{ $divide: ["$hommes", "$total_count"] }, 100] },
              1,
            ],
          },
          enseignants_chercheurs_percent: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$enseignants_chercheurs", "$total_count"] },
                  100,
                ],
              },
              1,
            ],
          },
          titulaires_percent: {
            $round: [
              {
                $multiply: [{ $divide: ["$titulaires", "$total_count"] }, 100],
              },
              1,
            ],
          },
          ec_titulaires_percent: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$ec_titulaires", "$total_count"] },
                  100,
                ],
              },
              1,
            ],
          },
        },
      },

      {
        $addFields: {
          disciplines: {
            $map: {
              input: "$disciplines",
              as: "discipline",
              in: {
                $mergeObjects: [
                  "$$discipline",
                  {
                    femmes_percent: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                "$$discipline.femmes",
                                "$$discipline.total_count",
                              ],
                            },
                            100,
                          ],
                        },
                        1,
                      ],
                    },
                    hommes_percent: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                "$$discipline.hommes",
                                "$$discipline.total_count",
                              ],
                            },
                            100,
                          ],
                        },
                        1,
                      ],
                    },
                    titulaires_percent: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                "$$discipline.titulaires",
                                "$$discipline.total_count",
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
                                "$$discipline.enseignants_chercheurs",
                                "$$discipline.total_count",
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
                    age_distribution: {
                      $map: {
                        input: "$$discipline.age_distribution",
                        as: "age",
                        in: {
                          $mergeObjects: [
                            "$$age",
                            {
                              percent: {
                                $round: [
                                  {
                                    $multiply: [
                                      {
                                        $divide: [
                                          "$$age.total",
                                          "$$discipline.total_count",
                                        ],
                                      },
                                      100,
                                    ],
                                  },
                                  1,
                                ],
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },

      { $sort: { academic_year: 1 } },

      {
        $project: {
          _id: 0,
          academic_year: 1,
          total_count: 1,
          femmes: 1,
          hommes: 1,
          inconnus: 1,
          femmes_percent: 1,
          hommes_percent: 1,
          enseignants_chercheurs: 1,
          titulaires: 1,
          non_titulaires: 1,
          ec_titulaires: 1,
          enseignants_chercheurs_percent: 1,
          titulaires_percent: 1,
          ec_titulaires_percent: 1,
          disciplines: 1,
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

    await source.aggregate(pipeline).toArray();
  } catch (error) {
    console.error("Erreur lors de la création des données d'évolution:", error);
  } finally {
    await client.close();
    console.log("Connexion fermée");
  }
}

createTrendsCollection().catch(console.error);
