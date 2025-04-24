import { MongoClient } from "mongodb";

async function analyzeByEstablishmentType() {
  const client = new MongoClient("mongodb://localhost:27017/");

  try {
    await client.connect();
    const db = client.db("datasupr");
    const source = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );
    const targetCollectionName = "teaching-staff-establishment-types";

    const pipeline = [
      {
        $group: {
          _id: {
            academic_year: "$annee_universitaire",
            establishment_type: "$etablissement_type",
            sexe: "$sexe",
            is_titulaire: "$is_titulaire",
            is_enseignant_chercheur: "$is_enseignant_chercheur",
            grande_discipline: "$grande_discipline",
            code_grande_discipline: "$code_grande_discipline",
            classe_age3: "$classe_age3",
            quotite: "$quotite",
          },
          count: { $sum: "$effectif" },
        },
      },
      {
        $group: {
          _id: {
            academic_year: "$_id.academic_year",
            establishment_type: "$_id.establishment_type",
            grande_discipline: "$_id.grande_discipline",
            code_grande_discipline: "$_id.code_grande_discipline",
          },
          total_count: { $sum: "$count" },
          gender_counts: {
            $push: {
              sexe: "$_id.sexe",
              count: "$count",
            },
          },
          status_counts: {
            $push: {
              is_titulaire: "$_id.is_titulaire",
              is_enseignant_chercheur: "$_id.is_enseignant_chercheur",
              count: "$count",
            },
          },
          age_distribution: {
            $push: {
              age_group: "$_id.classe_age3",
              count: "$count",
            },
          },
          quotite_distribution: {
            $push: {
              quotite: "$_id.quotite",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          academic_year: "$_id.academic_year",
          establishment_type: "$_id.establishment_type",
          discipline_id: "$_id.code_grande_discipline",
          discipline_label: "$_id.grande_discipline",
          total_count: 1,
          femmes: {
            $sum: {
              $map: {
                input: "$gender_counts",
                as: "gender",
                in: {
                  $cond: [
                    { $eq: ["$$gender.sexe", "Féminin"] },
                    "$$gender.count",
                    0,
                  ],
                },
              },
            },
          },
          hommes: {
            $sum: {
              $map: {
                input: "$gender_counts",
                as: "gender",
                in: {
                  $cond: [
                    { $eq: ["$$gender.sexe", "Masculin"] },
                    "$$gender.count",
                    0,
                  ],
                },
              },
            },
          },
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
          titulaires_percent: {
            $round: [
              {
                $multiply: [{ $divide: ["$titulaires", "$total_count"] }, 100],
              },
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
        $group: {
          _id: {
            academic_year: "$academic_year",
            establishment_type: "$establishment_type",
          },
          disciplines: {
            $push: {
              discipline_id: "$discipline_id",
              discipline_label: "$discipline_label",
              total_count: "$total_count",
              femmes: "$femmes",
              hommes: "$hommes",
              femmes_percent: "$femmes_percent",
              hommes_percent: "$hommes_percent",
              titulaires: "$titulaires",
              enseignants_chercheurs: "$enseignants_chercheurs",
              ec_titulaires: "$ec_titulaires",
              titulaires_percent: "$titulaires_percent",
              enseignants_chercheurs_percent: "$enseignants_chercheurs_percent",
              ec_titulaires_percent: "$ec_titulaires_percent",
            },
          },
          total_count: { $sum: "$total_count" },
          total_femmes: { $sum: "$femmes" },
          total_hommes: { $sum: "$hommes" },
          total_titulaires: { $sum: "$titulaires" },
          total_enseignants_chercheurs: { $sum: "$enseignants_chercheurs" },
          total_ec_titulaires: { $sum: "$ec_titulaires" },
        },
      },
      {
        $addFields: {
          femmes_percent: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$total_femmes", "$total_count"] },
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
                  { $divide: ["$total_hommes", "$total_count"] },
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
                  { $divide: ["$total_titulaires", "$total_count"] },
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
                    $divide: ["$total_enseignants_chercheurs", "$total_count"],
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
                  { $divide: ["$total_ec_titulaires", "$total_count"] },
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
            $sortArray: {
              input: "$disciplines",
              sortBy: { total_count: -1 },
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.academic_year",
          establishment_types: {
            $push: {
              type: "$_id.establishment_type",
              total_count: "$total_count",
              femmes: "$total_femmes",
              hommes: "$total_hommes",
              femmes_percent: "$femmes_percent",
              hommes_percent: "$hommes_percent",
              titulaires: "$total_titulaires",
              enseignants_chercheurs: "$total_enseignants_chercheurs",
              ec_titulaires: "$total_ec_titulaires",
              titulaires_percent: "$titulaires_percent",
              enseignants_chercheurs_percent: "$enseignants_chercheurs_percent",
              ec_titulaires_percent: "$ec_titulaires_percent",
              disciplines: "$disciplines",
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
          establishment_types: {
            $sortArray: {
              input: "$establishment_types",
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

analyzeByEstablishmentType()
  .then(() => {
    console.log("Script exécuté avec succès");
  })
  .catch((err) => {
    console.error("Erreur lors de l'exécution du script:", err);
  });
