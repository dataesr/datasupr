import { MongoClient } from "mongodb";

async function analyzeTeacherStatusByDiscipline() {
  const client = new MongoClient("mongodb://localhost:27017/");

  try {
    await client.connect();
    const db = client.db("datasupr");
    const source = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );
    const targetCollectionName = "teaching-staff-discipline-status";

    const pipeline = [
      {
        $group: {
          _id: {
            academic_year: "$annee_universitaire",
            field_id: "$code_grande_discipline",
            field_label: "$grande_discipline",
            is_titulaire: "$is_titulaire",
            is_enseignant_chercheur: "$is_enseignant_chercheur",
          },
          count: { $sum: "$effectif" },
        },
      },
      {
        $group: {
          _id: {
            academic_year: "$_id.academic_year",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
          },
          status_counts: {
            $push: {
              is_titulaire: "$_id.is_titulaire",
              is_enseignant_chercheur: "$_id.is_enseignant_chercheur",
              count: "$count",
            },
          },
          total_count: { $sum: "$count" },
        },
      },
      {
        $project: {
          _id: 0,
          academic_year: "$_id.academic_year",
          field_id: "$_id.field_id",
          field_label: "$_id.field_label",
          total_count: 1,
          titulaires: {
            $sum: {
              $map: {
                input: "$status_counts",
                as: "status",
                in: {
                  $cond: ["$$status.is_titulaire", "$$status.count", 0],
                },
              },
            },
          },
          non_titulaires: {
            $sum: {
              $map: {
                input: "$status_counts",
                as: "status",
                in: {
                  $cond: ["$$status.is_titulaire", 0, "$$status.count"],
                },
              },
            },
          },
          enseignants_chercheurs: {
            $sum: {
              $map: {
                input: "$status_counts",
                as: "status",
                in: {
                  $cond: [
                    "$$status.is_enseignant_chercheur",
                    "$$status.count",
                    0,
                  ],
                },
              },
            },
          },
          non_enseignants_chercheurs: {
            $sum: {
              $map: {
                input: "$status_counts",
                as: "status",
                in: {
                  $cond: [
                    "$$status.is_enseignant_chercheur",
                    0,
                    "$$status.count",
                  ],
                },
              },
            },
          },
          titulaires_percent: {
            $multiply: [
              {
                $divide: [
                  {
                    $sum: {
                      $map: {
                        input: "$status_counts",
                        as: "status",
                        in: {
                          $cond: ["$$status.is_titulaire", "$$status.count", 0],
                        },
                      },
                    },
                  },
                  "$total_count",
                ],
              },
              100,
            ],
          },
          enseignants_chercheurs_percent: {
            $multiply: [
              {
                $divide: [
                  {
                    $sum: {
                      $map: {
                        input: "$status_counts",
                        as: "status",
                        in: {
                          $cond: [
                            "$$status.is_enseignant_chercheur",
                            "$$status.count",
                            0,
                          ],
                        },
                      },
                    },
                  },
                  "$total_count",
                ],
              },
              100,
            ],
          },
          ec_titulaires: {
            $sum: {
              $map: {
                input: "$status_counts",
                as: "status",
                in: {
                  $cond: [
                    {
                      $and: [
                        "$$status.is_titulaire",
                        "$$status.is_enseignant_chercheur",
                      ],
                    },
                    "$$status.count",
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$academic_year",
          disciplines: {
            $push: {
              field_id: "$field_id",
              field_label: "$field_label",
              total_count: "$total_count",
              titulaires: "$titulaires",
              non_titulaires: "$non_titulaires",
              titulaires_percent: { $round: ["$titulaires_percent", 1] },
              enseignants_chercheurs: "$enseignants_chercheurs",
              non_enseignants_chercheurs: "$non_enseignants_chercheurs",
              enseignants_chercheurs_percent: {
                $round: ["$enseignants_chercheurs_percent", 1],
              },
              ec_titulaires: "$ec_titulaires",
            },
          },
          total_annee: { $sum: "$total_count" },
        },
      },
      {
        $project: {
          _id: 0,
          academic_year: "$_id",
          total_count: "$total_annee",
          disciplines: {
            $sortArray: {
              input: "$disciplines",
              sortBy: { total_count: -1 },
            },
          },
          last_updated: { $literal: new Date() },
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
    console.log(
      `Analyse terminée ! Données enregistrées dans la collection ${targetCollectionName}`
    );

    console.log(`Nombre d'années académiques traitées: ${result.length}`);

    return result;
  } finally {
    await client.close();
  }
}

analyzeTeacherStatusByDiscipline()
  .then(() => {
    console.log("Script exécuté avec succès");
  })
  .catch((err) => {
    console.error("Erreur lors de l'exécution du script:", err);
  });
