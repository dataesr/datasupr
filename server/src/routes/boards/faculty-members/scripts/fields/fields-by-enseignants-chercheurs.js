import { MongoClient } from "mongodb";

async function analyzeResearchTeachersByDiscipline() {
  const client = new MongoClient("mongodb://localhost:27017/");

  try {
    await client.connect();
    const db = client.db("datasupr");
    const source = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );
    const targetCollectionName = "teaching-staff-research-teachers-by-fields";

    const pipeline = [
      {
        $match: {
          is_enseignant_chercheur: true,
        },
      },

      {
        $group: {
          _id: {
            academic_year: "$annee_universitaire",
            sexe: "$sexe",
            classe_age3: "$classe_age3",
            discipline_code: "$code_grande_discipline",
            discipline_label: "$grande_discipline",
            cnu_group_code: "$code_groupe_cnu",
            cnu_group_label: "$groupe_cnu",
            cnu_section_code: "$code_section_cnu",
            cnu_section_label: "$section_cnu",
          },
          total_count: { $sum: "$effectif" },

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

          categorie_distribution: {
            $push: {
              $cond: [
                { $ne: ["$categorie_pers_grp", null] },
                {
                  k: "$categorie_pers_grp",
                  code: "$code_categorie_pers",
                  v: "$effectif",
                },
                "$$REMOVE",
              ],
            },
          },

          etablissement_distribution: {
            $push: {
              $cond: [
                { $ne: ["$etablissement_lib", null] },
                {
                  nom: "$etablissement_lib",
                  id: "$etablissement_id_paysage",
                  uai: "$etablissement_id_uai",
                  type: "$etablissement_type",
                  region: "$etablissement_region",
                  academie: "$etablissement_academie",
                  count: "$effectif",
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
          classe_age3: "$_id.classe_age3",
          discipline: {
            code: "$_id.discipline_code",
            label: "$_id.discipline_label",
          },
          cnu_group: {
            code: "$_id.cnu_group_code",
            label: "$_id.cnu_group_label",
          },
          cnu_section: {
            code: "$_id.cnu_section_code",
            label: "$_id.cnu_section_label",
          },
          total_count: 1,

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
                    code: {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$categorie_distribution",
                                    as: "cat",
                                    cond: { $eq: ["$$cat.k", "$$categorie"] },
                                  },
                                },
                                as: "filtered",
                                in: "$$filtered.code",
                              },
                            },
                            0,
                          ],
                        },
                        "",
                      ],
                    },
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

          etablissements: {
            $map: {
              input: {
                $setUnion: "$etablissement_distribution",
              },
              as: "etab",
              in: {
                nom: "$$etab.nom",
                id_paysage: "$$etab.id",
                uai: "$$etab.uai",
                type: "$$etab.type",
                region: "$$etab.region",
                academie: "$$etab.academie",
                count: "$$etab.count",
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
            discipline_label: "$discipline.label",
            cnu_group_code: "$cnu_group.code",
            cnu_group_label: "$cnu_group.label",
            sexe: "$sexe",
            classe_age3: "$classe_age3",
          },
          total_count: { $sum: "$total_count" },
          cnu_sections: {
            $push: {
              code: "$cnu_section.code",
              label: "$cnu_section.label",
              total_count: "$total_count",
            },
          },
          age_distribution: { $first: "$age_distribution" },
          categorie_distribution: { $first: "$categorie_distribution" },
          etablissements: { $first: "$etablissements" },
        },
      },

      {
        $group: {
          _id: {
            academic_year: "$_id.academic_year",
            discipline_code: "$_id.discipline_code",
            discipline_label: "$_id.discipline_label",
            cnu_group_code: "$_id.cnu_group_code",
            cnu_group_label: "$_id.cnu_group_label",
          },
          total_group_count: { $sum: "$total_count" },
          gender_age_data: {
            $push: {
              sexe: "$_id.sexe",
              classe_age3: "$_id.classe_age3",
              total_count: "$total_count",
              cnu_sections: "$cnu_sections",
              categorie_distribution: "$categorie_distribution",
              etablissements: "$etablissements",
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          academic_year: "$_id.academic_year",
          discipline: {
            code: "$_id.discipline_code",
            label: "$_id.discipline_label",
          },
          cnu_group: {
            code: "$_id.cnu_group_code",
            label: "$_id.cnu_group_label",
          },
          total_count: "$total_group_count",

          male_count: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$gender_age_data",
                    as: "item",
                    cond: { $eq: ["$$item.sexe", "Masculin"] },
                  },
                },
                as: "m",
                in: "$$m.total_count",
              },
            },
          },
          female_count: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$gender_age_data",
                    as: "item",
                    cond: { $eq: ["$$item.sexe", "Féminin"] },
                  },
                },
                as: "f",
                in: "$$f.total_count",
              },
            },
          },
          unknown_count: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$gender_age_data",
                    as: "item",
                    cond: { $eq: ["$$item.sexe", "Inconnu"] },
                  },
                },
                as: "u",
                in: "$$u.total_count",
              },
            },
          },

          age_distribution: {
            younger_35: {
              count: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: {
                          $eq: ["$$item.classe_age3", "35 ans et moins"],
                        },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
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
                                    input: "$gender_age_data",
                                    as: "item",
                                    cond: {
                                      $eq: [
                                        "$$item.classe_age3",
                                        "35 ans et moins",
                                      ],
                                    },
                                  },
                                },
                                as: "filtered",
                                in: "$$filtered.total_count",
                              },
                            },
                          },
                          { $max: ["$total_group_count", 1] },
                        ],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
              maleCount: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: {
                          $and: [
                            { $eq: ["$$item.sexe", "Masculin"] },
                            { $eq: ["$$item.classe_age3", "35 ans et moins"] },
                          ],
                        },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
                  },
                },
              },
              femaleCount: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: {
                          $and: [
                            { $eq: ["$$item.sexe", "Féminin"] },
                            { $eq: ["$$item.classe_age3", "35 ans et moins"] },
                          ],
                        },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
                  },
                },
              },
            },
            middle_36_55: {
              count: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: { $eq: ["$$item.classe_age3", "36 à 55 ans"] },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
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
                                    input: "$gender_age_data",
                                    as: "item",
                                    cond: {
                                      $eq: [
                                        "$$item.classe_age3",
                                        "36 à 55 ans",
                                      ],
                                    },
                                  },
                                },
                                as: "filtered",
                                in: "$$filtered.total_count",
                              },
                            },
                          },
                          { $max: ["$total_group_count", 1] },
                        ],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
              maleCount: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: {
                          $and: [
                            { $eq: ["$$item.sexe", "Masculin"] },
                            { $eq: ["$$item.classe_age3", "36 à 55 ans"] },
                          ],
                        },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
                  },
                },
              },
              femaleCount: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: {
                          $and: [
                            { $eq: ["$$item.sexe", "Féminin"] },
                            { $eq: ["$$item.classe_age3", "36 à 55 ans"] },
                          ],
                        },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
                  },
                },
              },
            },
            older_56: {
              count: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: { $eq: ["$$item.classe_age3", "56 ans et plus"] },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
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
                                    input: "$gender_age_data",
                                    as: "item",
                                    cond: {
                                      $eq: [
                                        "$$item.classe_age3",
                                        "56 ans et plus",
                                      ],
                                    },
                                  },
                                },
                                as: "filtered",
                                in: "$$filtered.total_count",
                              },
                            },
                          },
                          { $max: ["$total_group_count", 1] },
                        ],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
              maleCount: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: {
                          $and: [
                            { $eq: ["$$item.sexe", "Masculin"] },
                            { $eq: ["$$item.classe_age3", "56 ans et plus"] },
                          ],
                        },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
                  },
                },
              },
              femaleCount: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$gender_age_data",
                        as: "item",
                        cond: {
                          $and: [
                            { $eq: ["$$item.sexe", "Féminin"] },
                            { $eq: ["$$item.classe_age3", "56 ans et plus"] },
                          ],
                        },
                      },
                    },
                    as: "filtered",
                    in: "$$filtered.total_count",
                  },
                },
              },
            },
          },

          cnu_sections: {
            $reduce: {
              input: {
                $setUnion: {
                  $map: {
                    input: {
                      $setUnion: {
                        $reduce: {
                          input: "$gender_age_data",
                          initialValue: [],
                          in: {
                            $concatArrays: ["$$value", "$$this.cnu_sections"],
                          },
                        },
                      },
                    },
                    as: "section",
                    in: {
                      code: "$$section.code",
                      label: "$$section.label",
                    },
                  },
                },
              },
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  [
                    {
                      $let: {
                        vars: {
                          current_section: "$$this",
                          male_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: { $eq: ["$$g.sexe", "Masculin"] },
                            },
                          },
                          female_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: { $eq: ["$$g.sexe", "Féminin"] },
                            },
                          },
                          age_35_moins_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $eq: ["$$g.classe_age3", "35 ans et moins"],
                              },
                            },
                          },
                          age_36_55_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: { $eq: ["$$g.classe_age3", "36 à 55 ans"] },
                            },
                          },
                          age_56_plus_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $eq: ["$$g.classe_age3", "56 ans et plus"],
                              },
                            },
                          },
                          male_35_moins_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $and: [
                                  { $eq: ["$$g.sexe", "Masculin"] },
                                  {
                                    $eq: ["$$g.classe_age3", "35 ans et moins"],
                                  },
                                ],
                              },
                            },
                          },
                          male_36_55_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $and: [
                                  { $eq: ["$$g.sexe", "Masculin"] },
                                  { $eq: ["$$g.classe_age3", "36 à 55 ans"] },
                                ],
                              },
                            },
                          },
                          male_56_plus_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $and: [
                                  { $eq: ["$$g.sexe", "Masculin"] },
                                  {
                                    $eq: ["$$g.classe_age3", "56 ans et plus"],
                                  },
                                ],
                              },
                            },
                          },
                          female_35_moins_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $and: [
                                  { $eq: ["$$g.sexe", "Féminin"] },
                                  {
                                    $eq: ["$$g.classe_age3", "35 ans et moins"],
                                  },
                                ],
                              },
                            },
                          },
                          female_36_55_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $and: [
                                  { $eq: ["$$g.sexe", "Féminin"] },
                                  { $eq: ["$$g.classe_age3", "36 à 55 ans"] },
                                ],
                              },
                            },
                          },
                          female_56_plus_data: {
                            $filter: {
                              input: "$gender_age_data",
                              as: "g",
                              cond: {
                                $and: [
                                  { $eq: ["$$g.sexe", "Féminin"] },
                                  {
                                    $eq: ["$$g.classe_age3", "56 ans et plus"],
                                  },
                                ],
                              },
                            },
                          },
                        },
                        in: {
                          cnuSectionId: "$$current_section.code",
                          cnuSectionLabel: "$$current_section.label",
                          totalCount: {
                            $sum: {
                              $map: {
                                input: {
                                  $reduce: {
                                    input: "$gender_age_data",
                                    initialValue: [],
                                    in: {
                                      $concatArrays: [
                                        "$$value",
                                        "$$this.cnu_sections",
                                      ],
                                    },
                                  },
                                },
                                as: "section",
                                in: {
                                  $cond: [
                                    {
                                      $eq: [
                                        "$$section.code",
                                        "$$current_section.code",
                                      ],
                                    },
                                    "$$section.total_count",
                                    0,
                                  ],
                                },
                              },
                            },
                          },
                          femaleCount: {
                            $sum: {
                              $map: {
                                input: {
                                  $reduce: {
                                    input: "$$female_data",
                                    initialValue: [],
                                    in: {
                                      $concatArrays: [
                                        "$$value",
                                        "$$this.cnu_sections",
                                      ],
                                    },
                                  },
                                },
                                as: "section",
                                in: {
                                  $cond: [
                                    {
                                      $eq: [
                                        "$$section.code",
                                        "$$current_section.code",
                                      ],
                                    },
                                    "$$section.total_count",
                                    0,
                                  ],
                                },
                              },
                            },
                          },
                          maleCount: {
                            $sum: {
                              $map: {
                                input: {
                                  $reduce: {
                                    input: "$$male_data",
                                    initialValue: [],
                                    in: {
                                      $concatArrays: [
                                        "$$value",
                                        "$$this.cnu_sections",
                                      ],
                                    },
                                  },
                                },
                                as: "section",
                                in: {
                                  $cond: [
                                    {
                                      $eq: [
                                        "$$section.code",
                                        "$$current_section.code",
                                      ],
                                    },
                                    "$$section.total_count",
                                    0,
                                  ],
                                },
                              },
                            },
                          },
                          ageDistribution: [
                            {
                              ageClass: "35 ans et moins",
                              count: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$age_35_moins_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
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
                                                  $reduce: {
                                                    input:
                                                      "$$age_35_moins_data",
                                                    initialValue: [],
                                                    in: {
                                                      $concatArrays: [
                                                        "$$value",
                                                        "$$this.cnu_sections",
                                                      ],
                                                    },
                                                  },
                                                },
                                                as: "section",
                                                in: {
                                                  $cond: [
                                                    {
                                                      $eq: [
                                                        "$$section.code",
                                                        "$$current_section.code",
                                                      ],
                                                    },
                                                    "$$section.total_count",
                                                    0,
                                                  ],
                                                },
                                              },
                                            },
                                          },
                                          {
                                            $max: [
                                              {
                                                $sum: {
                                                  $map: {
                                                    input: {
                                                      $reduce: {
                                                        input:
                                                          "$gender_age_data",
                                                        initialValue: [],
                                                        in: {
                                                          $concatArrays: [
                                                            "$$value",
                                                            "$$this.cnu_sections",
                                                          ],
                                                        },
                                                      },
                                                    },
                                                    as: "section",
                                                    in: {
                                                      $cond: [
                                                        {
                                                          $eq: [
                                                            "$$section.code",
                                                            "$$current_section.code",
                                                          ],
                                                        },
                                                        "$$section.total_count",
                                                        0,
                                                      ],
                                                    },
                                                  },
                                                },
                                              },
                                              1,
                                            ],
                                          },
                                        ],
                                      },
                                      100,
                                    ],
                                  },
                                  1,
                                ],
                              },
                              maleCount: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$male_35_moins_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
                                  },
                                },
                              },
                              femaleCount: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$female_35_moins_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
                                  },
                                },
                              },
                            },
                            {
                              ageClass: "36 à 55 ans",
                              count: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$age_36_55_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
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
                                                  $reduce: {
                                                    input: "$$age_36_55_data",
                                                    initialValue: [],
                                                    in: {
                                                      $concatArrays: [
                                                        "$$value",
                                                        "$$this.cnu_sections",
                                                      ],
                                                    },
                                                  },
                                                },
                                                as: "section",
                                                in: {
                                                  $cond: [
                                                    {
                                                      $eq: [
                                                        "$$section.code",
                                                        "$$current_section.code",
                                                      ],
                                                    },
                                                    "$$section.total_count",
                                                    0,
                                                  ],
                                                },
                                              },
                                            },
                                          },
                                          {
                                            $max: [
                                              {
                                                $sum: {
                                                  $map: {
                                                    input: {
                                                      $reduce: {
                                                        input:
                                                          "$gender_age_data",
                                                        initialValue: [],
                                                        in: {
                                                          $concatArrays: [
                                                            "$$value",
                                                            "$$this.cnu_sections",
                                                          ],
                                                        },
                                                      },
                                                    },
                                                    as: "section",
                                                    in: {
                                                      $cond: [
                                                        {
                                                          $eq: [
                                                            "$$section.code",
                                                            "$$current_section.code",
                                                          ],
                                                        },
                                                        "$$section.total_count",
                                                        0,
                                                      ],
                                                    },
                                                  },
                                                },
                                              },
                                              1,
                                            ],
                                          },
                                        ],
                                      },
                                      100,
                                    ],
                                  },
                                  1,
                                ],
                              },
                              maleCount: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$male_36_55_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
                                  },
                                },
                              },
                              femaleCount: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$female_36_55_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
                                  },
                                },
                              },
                            },
                            {
                              ageClass: "56 ans et plus",
                              count: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$age_56_plus_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
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
                                                  $reduce: {
                                                    input: "$$age_56_plus_data",
                                                    initialValue: [],
                                                    in: {
                                                      $concatArrays: [
                                                        "$$value",
                                                        "$$this.cnu_sections",
                                                      ],
                                                    },
                                                  },
                                                },
                                                as: "section",
                                                in: {
                                                  $cond: [
                                                    {
                                                      $eq: [
                                                        "$$section.code",
                                                        "$$current_section.code",
                                                      ],
                                                    },
                                                    "$$section.total_count",
                                                    0,
                                                  ],
                                                },
                                              },
                                            },
                                          },
                                          {
                                            $max: [
                                              {
                                                $sum: {
                                                  $map: {
                                                    input: {
                                                      $reduce: {
                                                        input:
                                                          "$gender_age_data",
                                                        initialValue: [],
                                                        in: {
                                                          $concatArrays: [
                                                            "$$value",
                                                            "$$this.cnu_sections",
                                                          ],
                                                        },
                                                      },
                                                    },
                                                    as: "section",
                                                    in: {
                                                      $cond: [
                                                        {
                                                          $eq: [
                                                            "$$section.code",
                                                            "$$current_section.code",
                                                          ],
                                                        },
                                                        "$$section.total_count",
                                                        0,
                                                      ],
                                                    },
                                                  },
                                                },
                                              },
                                              1,
                                            ],
                                          },
                                        ],
                                      },
                                      100,
                                    ],
                                  },
                                  1,
                                ],
                              },
                              maleCount: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$male_56_plus_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
                                  },
                                },
                              },
                              femaleCount: {
                                $sum: {
                                  $map: {
                                    input: {
                                      $reduce: {
                                        input: "$$female_56_plus_data",
                                        initialValue: [],
                                        in: {
                                          $concatArrays: [
                                            "$$value",
                                            "$$this.cnu_sections",
                                          ],
                                        },
                                      },
                                    },
                                    as: "section",
                                    in: {
                                      $cond: [
                                        {
                                          $eq: [
                                            "$$section.code",
                                            "$$current_section.code",
                                          ],
                                        },
                                        "$$section.total_count",
                                        0,
                                      ],
                                    },
                                  },
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                ],
              },
            },
          },
          gender_ratio: {
            female_percent: {
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
                                  input: "$gender_age_data",
                                  as: "item",
                                  cond: { $eq: ["$$item.sexe", "Féminin"] },
                                },
                              },
                              as: "f",
                              in: "$$f.total_count",
                            },
                          },
                        },
                        { $max: ["$total_group_count", 1] },
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
            male_percent: {
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
                                  input: "$gender_age_data",
                                  as: "item",
                                  cond: { $eq: ["$$item.sexe", "Masculin"] },
                                },
                              },
                              as: "m",
                              in: "$$m.total_count",
                            },
                          },
                        },
                        { $max: ["$total_group_count", 1] },
                      ],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
            gap: {
              $round: [
                {
                  $subtract: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $sum: {
                                $map: {
                                  input: {
                                    $filter: {
                                      input: "$gender_age_data",
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
                            },
                            { $max: ["$total_group_count", 1] },
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
                              $sum: {
                                $map: {
                                  input: {
                                    $filter: {
                                      input: "$gender_age_data",
                                      as: "item",
                                      cond: { $eq: ["$$item.sexe", "Féminin"] },
                                    },
                                  },
                                  as: "f",
                                  in: "$$f.total_count",
                                },
                              },
                            },
                            { $max: ["$total_group_count", 1] },
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

      {
        $group: {
          _id: {
            academic_year: "$academic_year",
            discipline_code: "$discipline.code",
            discipline_label: "$discipline.label",
          },
          cnu_groups: {
            $push: {
              cnuGroupId: "$cnu_group.code",
              cnuGroupLabel: "$cnu_group.label",
              totalCount: "$total_count",
              maleCount: "$male_count",
              femaleCount: "$female_count",
              unknownCount: "$unknown_count",
              cnuSections: "$cnu_sections",
              genderRatio: "$gender_ratio",
              ageDistribution: "$age_distribution",
            },
          },
          total_count: { $sum: "$total_count" },
          male_count: { $sum: "$male_count" },
          female_count: { $sum: "$female_count" },
          unknown_count: { $sum: "$unknown_count" },

          age_distribution_groups: { $push: "$age_distribution" },
        },
      },

      {
        $project: {
          _id: 0,
          year: "$_id.academic_year",
          field_id: "$_id.discipline_code",
          fieldLabel: "$_id.discipline_label",
          totalCount: "$total_count",
          maleCount: "$male_count",
          femaleCount: "$female_count",
          unknownCount: "$unknown_count",
          cnuGroups: "$cnu_groups",

          ageDistribution: [
            {
              ageClass: "35 ans et moins",
              count: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.younger_35.count", 0] },
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
                                input: "$age_distribution_groups",
                                as: "group",
                                in: {
                                  $ifNull: ["$$group.younger_35.count", 0],
                                },
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
              maleCount: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.younger_35.maleCount", 0] },
                  },
                },
              },
              femaleCount: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.younger_35.femaleCount", 0] },
                  },
                },
              },
            },
            {
              ageClass: "36 à 55 ans",
              count: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.middle_36_55.count", 0] },
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
                                input: "$age_distribution_groups",
                                as: "group",
                                in: {
                                  $ifNull: ["$$group.middle_36_55.count", 0],
                                },
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
              maleCount: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.middle_36_55.maleCount", 0] },
                  },
                },
              },
              femaleCount: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.middle_36_55.femaleCount", 0] },
                  },
                },
              },
            },
            {
              ageClass: "56 ans et plus",
              count: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.older_56.count", 0] },
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
                                input: "$age_distribution_groups",
                                as: "group",
                                in: { $ifNull: ["$$group.older_56.count", 0] },
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
              maleCount: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.older_56.maleCount", 0] },
                  },
                },
              },
              femaleCount: {
                $sum: {
                  $map: {
                    input: "$age_distribution_groups",
                    as: "group",
                    in: { $ifNull: ["$$group.older_56.femaleCount", 0] },
                  },
                },
              },
            },
          ],
          last_updated: { $literal: new Date() },
        },
      },

      {
        $sort: {
          year: 1,
          field_id: 1,
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

analyzeResearchTeachersByDiscipline()
  .then(() => {
    console.log(
      "Script d'analyse des enseignants-chercheurs par discipline exécuté avec succès"
    );
  })
  .catch((err) => {
    console.error("Erreur lors de l'exécution du script:", err);
    process.exit(1);
  });
