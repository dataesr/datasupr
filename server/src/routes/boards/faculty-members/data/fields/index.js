import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/fields", async (req, res) => {
  try {
    const collection = db.collection("faculty-members_main_staging");

    const fields = await collection
      .aggregate([
        {
          $group: {
            _id: {
              id: "$code_grande_discipline",
              lib: "$grande_discipline",
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
      fields: fields,
    });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({
      error: "Server error while fetching fields",
    });
  }
});

router.get("/faculty-members/fields/cnu-analysis", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;
    if (field_id) matchStage.code_grande_discipline = field_id;

    const cnuGroupsWithSections = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
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
            section_total: { $sum: "$count" },
            section_details: {
              $push: {
                gender: "$_id.gender",
                age_range: "$_id.age_range",
                count: "$count",
              },
            },
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
            group_total: { $sum: "$section_total" },
            sections: {
              $push: {
                section_code: "$_id.section_code",
                section_name: "$_id.section_name",
                section_total: "$section_total",
                details: "$section_details",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
            },
            discipline_total: { $sum: "$group_total" },
            groups: {
              $push: {
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
                group_total: "$group_total",
                sections: "$sections",
              },
            },
          },
        },
        { $sort: { discipline_total: -1 } },
      ])
      .toArray();

    const genderByGroups = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              discipline_code: "$code_grande_discipline", // AJOUT
              discipline_name: "$grande_discipline", // AJOUT
              group_code: "$code_groupe_cnu",
              group_name: "$groupe_cnu",
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
            },
            details: {
              $push: {
                gender: "$_id.gender",
                age_range: "$_id.age_range",
                count: "$count",
              },
            },
            total: { $sum: "$count" },
          },
        },
        { $sort: { total: -1 } },
      ])
      .toArray();

    res.json({
      cnu_groups_with_sections: cnuGroupsWithSections,
      gender_summary_by_CNU_groups: genderByGroups,
    });
  } catch (error) {
    console.error("Error fetching CNU analysis:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/evolution", async (req, res) => {
  try {
    const { field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (field_id) matchStage.code_grande_discipline = field_id;

    const [
      years,
      globalEvolution,
      statusEvolution,
      ageEvolution,
      disciplineEvolution,
      contextInfo,
    ] = await Promise.all([
      collection
        .distinct("annee_universitaire", matchStage)
        .then((years) => years.filter((y) => y != null).sort()),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$annee_universitaire",
              total_count: { $sum: "$effectif" },
              male_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Masculin"] }, "$effectif", 0],
                },
              },
              female_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0],
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$annee_universitaire",
              total_count: { $sum: "$effectif" },
              enseignant_chercheur_count: {
                $sum: {
                  $cond: [
                    { $eq: ["$is_enseignant_chercheur", true] },
                    "$effectif",
                    0,
                  ],
                },
              },
              titulaire_non_chercheur_count: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$is_titulaire", true] },
                        { $eq: ["$is_enseignant_chercheur", false] },
                      ],
                    },
                    "$effectif",
                    0,
                  ],
                },
              },
              non_titulaire_count: {
                $sum: {
                  $cond: [{ $eq: ["$is_titulaire", false] }, "$effectif", 0],
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                annee_universitaire: "$annee_universitaire",
                age_class: "$classe_age3",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.annee_universitaire",
              total_count: { $sum: "$count" },
              age_breakdown: {
                $push: {
                  age_class: "$_id.age_class",
                  count: "$count",
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      !field_id
        ? collection
            .aggregate([
              { $match: matchStage },
              {
                $group: {
                  _id: {
                    annee_universitaire: "$annee_universitaire",
                    discipline_code: "$code_grande_discipline",
                    discipline_name: "$grande_discipline",
                  },
                  total_count: { $sum: "$effectif" },
                  male_count: {
                    $sum: {
                      $cond: [{ $eq: ["$sexe", "Masculin"] }, "$effectif", 0],
                    },
                  },
                  female_count: {
                    $sum: {
                      $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0],
                    },
                  },
                },
              },
              {
                $match: {
                  "_id.discipline_code": { $ne: null },
                  "_id.discipline_name": { $ne: null },
                },
              },
              { $sort: { "_id.annee_universitaire": 1, total_count: -1 } },
              { $limit: 100 },
            ])
            .toArray()
        : Promise.resolve([]),

      field_id
        ? collection.findOne(
            { code_grande_discipline: field_id },
            { projection: { grande_discipline: 1, code_grande_discipline: 1 } }
          )
        : Promise.resolve(null),
    ]);

    const processedGlobalEvolution = globalEvolution.map((item) => ({
      _id: item._id,
      total_count: item.total_count,
      gender_breakdown: [
        { gender: "Masculin", count: item.male_count },
        { gender: "Féminin", count: item.female_count },
      ].filter((g) => g.count > 0),
    }));

    const processedStatusEvolution = statusEvolution.map((item) => ({
      _id: item._id,
      total_count: item.total_count,
      status_breakdown: [
        {
          status: "enseignant_chercheur",
          count: item.enseignant_chercheur_count,
        },
        {
          status: "titulaire_non_chercheur",
          count: item.titulaire_non_chercheur_count,
        },
        { status: "non_titulaire", count: item.non_titulaire_count },
      ].filter((s) => s.count > 0),
    }));

    const processedDisciplineEvolution = disciplineEvolution
      .sort((a, b) => b.total_count - a.total_count)
      .slice(0, 10)
      .map((item) => ({
        _id: item._id,
        total_count: item.total_count,
        gender_breakdown: [
          { gender: "Masculin", count: item.male_count },
          { gender: "Féminin", count: item.female_count },
        ].filter((g) => g.count > 0),
      }));

    let processedContextInfo = null;
    if (field_id && contextInfo) {
      processedContextInfo = {
        id: contextInfo.code_grande_discipline,
        name: contextInfo.grande_discipline,
        type: "discipline",
      };
    }

    res.json({
      context_info: processedContextInfo,
      years: years,
      global_evolution: processedGlobalEvolution,
      status_evolution: processedStatusEvolution,
      age_evolution: ageEvolution,
      discipline_evolution: processedDisciplineEvolution,
    });
  } catch (error) {
    console.error("Error fetching fields evolution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/research-teachers", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {
      is_titulaire: true,
    };
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (field_id) {
      matchStage.code_grande_discipline = field_id;
    }

    const ageClasses = [
      "35 ans et moins",
      "36 à 55 ans",
      "56 ans et plus",
      "Non précisé",
    ];

    const cnuData = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              group_code: "$code_groupe_cnu",
              group_name: "$groupe_cnu",
              section_code: "$code_section_cnu",
              section_name: "$section_cnu",
              gender: "$sexe",
              age_class: "$classe_age3",
              category_name: "$categorie_assimilation",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
              section_code: "$_id.section_code",
              section_name: "$_id.section_name",
              age_class: "$_id.age_class",
            },
            maleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Masculin"] }, "$count", 0],
              },
            },
            femaleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Féminin"] }, "$count", 0],
              },
            },
            totalCount: { $sum: "$count" },
            categories: {
              $push: {
                categoryName: "$_id.category_name",
                count: "$count",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
              section_code: "$_id.section_code",
              section_name: "$_id.section_name",
            },
            maleCount: { $sum: "$maleCount" },
            femaleCount: { $sum: "$femaleCount" },
            totalCount: { $sum: "$totalCount" },
            ageDistribution: {
              $push: {
                ageClass: "$_id.age_class",
                count: "$totalCount",
              },
            },
            categories: {
              $push: "$categories",
            },
          },
        },
        {
          $addFields: {
            categories: {
              $reduce: {
                input: "$categories",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
        {
          $addFields: {
            categories: {
              $filter: {
                input: {
                  $map: {
                    input: {
                      $setUnion: [
                        {
                          $map: {
                            input: "$categories",
                            as: "cat",
                            in: "$$cat.categoryName",
                          },
                        },
                      ],
                    },
                    as: "catName",
                    in: {
                      categoryName: "$$catName",
                      count: {
                        $sum: {
                          $map: {
                            input: {
                              $filter: {
                                input: "$categories",
                                as: "cat",
                                cond: {
                                  $eq: ["$$cat.categoryName", "$$catName"],
                                },
                              },
                            },
                            as: "fcat",
                            in: "$$fcat.count",
                          },
                        },
                      },
                    },
                  },
                },
                as: "cat",
                cond: { $ne: ["$$cat.categoryName", null] },
              },
            },
          },
        },
        {
          $group: {
            _id: {
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
            },
            groupTotal: { $sum: "$totalCount" },
            maleCount: { $sum: "$maleCount" },
            femaleCount: { $sum: "$femaleCount" },
            sections: {
              $push: {
                sectionCode: "$_id.section_code",
                sectionName: "$_id.section_name",
                totalCount: "$totalCount",
                maleCount: "$maleCount",
                femaleCount: "$femaleCount",
                ageDistribution: "$ageDistribution",
                categories: "$categories",
              },
            },
            groupCategories: {
              $push: "$categories",
            },
          },
        },
        {
          $addFields: {
            categories: {
              $filter: {
                input: {
                  $map: {
                    input: {
                      $setUnion: [
                        {
                          $map: {
                            input: {
                              $reduce: {
                                input: "$groupCategories",
                                initialValue: [],
                                in: { $concatArrays: ["$$value", "$$this"] },
                              },
                            },
                            as: "cat",
                            in: "$$cat.categoryName",
                          },
                        },
                      ],
                    },
                    as: "catName",
                    in: {
                      categoryName: "$$catName",
                      count: {
                        $sum: {
                          $map: {
                            input: {
                              $filter: {
                                input: {
                                  $reduce: {
                                    input: "$groupCategories",
                                    initialValue: [],
                                    in: {
                                      $concatArrays: ["$$value", "$$this"],
                                    },
                                  },
                                },
                                as: "cat",
                                cond: {
                                  $eq: ["$$cat.categoryName", "$$catName"],
                                },
                              },
                            },
                            as: "fcat",
                            in: "$$fcat.count",
                          },
                        },
                      },
                    },
                  },
                },
                as: "cat",
                cond: { $ne: ["$$cat.categoryName", null] },
              },
            },
          },
        },
        { $project: { groupCategories: 0 } },
        {
          $addFields: {
            ageDistribution: ageClasses.map((ageClass) => ({
              ageClass,
              count: {
                $sum: {
                  $map: {
                    input: "$sections",
                    as: "section",
                    in: {
                      $sum: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$$section.ageDistribution",
                              as: "age",
                              cond: { $eq: ["$$age.ageClass", ageClass] },
                            },
                          },
                          as: "filteredAge",
                          in: "$$filteredAge.count",
                        },
                      },
                    },
                  },
                },
              },
              percent: {
                $cond: {
                  if: { $gt: ["$groupTotal", 0] },
                  then: {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $sum: {
                              $map: {
                                input: "$sections",
                                as: "section",
                                in: {
                                  $sum: {
                                    $map: {
                                      input: {
                                        $filter: {
                                          input: "$$section.ageDistribution",
                                          as: "age",
                                          cond: {
                                            $eq: ["$$age.ageClass", ageClass],
                                          },
                                        },
                                      },
                                      as: "filteredAge",
                                      in: "$$filteredAge.count",
                                    },
                                  },
                                },
                              },
                            },
                          },
                          "$groupTotal",
                        ],
                      },
                      100,
                    ],
                  },
                  else: 0,
                },
              },
            })),
          },
        },
        { $sort: { groupTotal: -1 } },
      ])
      .toArray();

    const categoryDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              category_code: "$code_categorie_assimil",
              category_name: "$categorie_assimilation",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              category_code: "$_id.category_code",
              category_name: "$_id.category_name",
            },
            totalCount: { $sum: "$count" },
            maleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Masculin"] }, "$count", 0],
              },
            },
            femaleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Féminin"] }, "$count", 0],
              },
            },
          },
        },
        { $sort: { totalCount: -1 } },
      ])
      .toArray();

    const disciplinesData = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              field_id: "$code_grande_discipline",
              fieldLabel: "$grande_discipline",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              field_id: "$_id.field_id",
              fieldLabel: "$_id.fieldLabel",
            },
            totalCount: { $sum: "$count" },
            genderBreakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },
        { $sort: { totalCount: -1 } },
      ])
      .toArray();

    const fields = disciplinesData.map((item) => {
      const maleCount =
        item.genderBreakdown.find((g) => g.gender === "Masculin")?.count || 0;
      const femaleCount =
        item.genderBreakdown.find((g) => g.gender === "Féminin")?.count || 0;

      return {
        field_id: item._id.field_id,
        fieldLabel: item._id.fieldLabel,
        maleCount: maleCount,
        femaleCount: femaleCount,
        totalCount: item.totalCount,
      };
    });

    res.json({
      cnuGroups: cnuData.map((group) => ({
        cnuGroupId: group._id.group_code,
        cnuGroupLabel: group._id.group_name,
        maleCount: group.maleCount,
        femaleCount: group.femaleCount,
        totalCount: group.groupTotal,
        ageDistribution: group.ageDistribution,
        categories: group.categories,
        cnuSections: group.sections.map((section) => ({
          cnuSectionId: section.sectionCode,
          cnuSectionLabel: section.sectionName,
          maleCount: section.maleCount,
          femaleCount: section.femaleCount,
          totalCount: section.totalCount,
          ageDistribution: ageClasses.map((ageClass) => ({
            ageClass,
            count:
              section.ageDistribution.find((a) => a.ageClass === ageClass)
                ?.count || 0,
          })),
          categories: section.categories,
        })),
      })),
      fields: fields,
      categoryDistribution: categoryDistribution.map((cat) => ({
        categoryCode: cat._id.category_code,
        categoryName: cat._id.category_name,
        maleCount: cat.maleCount,
        femaleCount: cat.femaleCount,
        totalCount: cat.totalCount,
      })),
    });
  } catch (error) {
    console.error("Error fetching research teachers by fields:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/faculty-members/fields/establishment-type-distribution",
  async (req, res) => {
    try {
      const { annee_universitaire, field_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (field_id) {
        matchStage.code_grande_discipline = field_id;
      }

      const establishmentTypeDistribution = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                establishment_type: "$etablissement_type",
                gender: "$sexe",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.establishment_type",
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
        establishment_type_distribution: establishmentTypeDistribution,
      });
    } catch (error) {
      console.error(
        "Error fetching establishment type distribution for fields:",
        error
      );
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/faculty-members/fields/age-distribution", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (field_id) {
      matchStage.code_grande_discipline = field_id;
    }

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

    res.json({
      age_distribution: ageDistribution,
    });
  } catch (error) {
    console.error("Error fetching age distribution for fields:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/faculty-members/fields/discipline-distribution",
  async (req, res) => {
    try {
      const { annee_universitaire, field_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (field_id) {
        matchStage.code_grande_discipline = field_id;
      }

      const disciplineDistribution = await collection
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

      res.json({
        discipline_distribution: disciplineDistribution,
      });
    } catch (error) {
      console.error(
        "Error fetching discipline distribution for fields:",
        error
      );
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/faculty-members/fields/status-distribution", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (field_id) {
      matchStage.code_grande_discipline = field_id;
    }

    const statusDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              field_code: "$code_grande_discipline",
              field_name: "$grande_discipline",
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
              field_code: "$_id.field_code",
              field_name: "$_id.field_name",
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

    res.json({
      status_distribution: statusDistribution,
    });
  } catch (error) {
    console.error("Error fetching status distribution for fields:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/general-indicators", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (field_id) {
      matchStage.code_grande_discipline = field_id;
    }

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

    res.json({
      gender_distribution: genderDistribution,
      total_count: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching general indicators for fields:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/gender-distribution", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (field_id) {
      matchStage.code_grande_discipline = field_id;
    }

    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              field_code: "$code_grande_discipline",
              field_name: "$grande_discipline",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              field_code: "$_id.field_code",
              field_name: "$_id.field_name",
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
      gender_distribution: genderDistribution,
    });
  } catch (error) {
    console.error("Error fetching gender distribution for fields:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/top-indicators", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (field_id) {
      matchStage.code_grande_discipline = field_id;
    }

    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              field_code: "$code_grande_discipline",
              field_name: "$grande_discipline",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              field_code: "$_id.field_code",
              field_name: "$_id.field_name",
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
      gender_distribution: genderDistribution,
    });
  } catch (error) {
    console.error("Error fetching top indicators for fields:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
