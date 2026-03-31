import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();
const COLLECTION = "faculty-members_main_staging";

const VALID_VIEWS = ["structure", "discipline", "region", "academie"];

function buildMatchStage(view, id, year) {
  const match = {};
  if (year) match.annee_universitaire = year;
  if (!id) return match;

  switch (view) {
    case "structure":
      match.etablissement_id_paysage = id;
      break;
    case "discipline":
      match.code_grande_discipline = id;
      break;
    case "region":
      match.etablissement_region = id;
      break;
    case "academie":
      match.etablissement_academie = id;
      break;
  }
  return match;
}

async function getContextInfo(collection, view, id) {
  if (!id) return null;

  const fieldMap = {
    structure: "etablissement_id_paysage",
    discipline: "code_grande_discipline",
    region: "etablissement_region",
    academie: "etablissement_academie",
  };

  const doc = await collection.findOne(
    { [fieldMap[view]]: id },
    {
      projection: {
        etablissement_lib: 1,
        etablissement_actuel_lib: 1,
        etablissement_type: 1,
        etablissement_region: 1,
        etablissement_academie: 1,
        grande_discipline: 1,
      },
    }
  );
  if (!doc) return null;

  const base = {
    region: doc.etablissement_region,
    academie: doc.etablissement_academie,
    structure_type: doc.etablissement_type,
  };

  switch (view) {
    case "structure":
      return {
        ...base,
        id,
        name: doc.etablissement_actuel_lib || doc.etablissement_lib,
      };
    case "discipline":
      return { ...base, id, name: doc.grande_discipline || id };
    case "region":
      return { ...base, id, name: doc.etablissement_region || id };
    case "academie":
      return { ...base, id, name: doc.etablissement_academie || id };
    default:
      return null;
  }
}

router.get("/faculty-members/filters", async (req, res) => {
  try {
    const { type } = req.query;
    const collection = db.collection(COLLECTION);

    const configMap = {
      structures: {
        groupId: {
          id: "$etablissement_id_paysage",
          label: "$etablissement_lib",
        },
      },
      disciplines: {
        groupId: {
          id: "$code_grande_discipline",
          label: "$grande_discipline",
        },
      },
      regions: {
        groupId: {
          id: "$etablissement_region",
          label: "$etablissement_region",
        },
      },
      academies: {
        groupId: {
          id: "$etablissement_academie",
          label: "$etablissement_academie",
        },
      },
    };

    const config = configMap[type];
    if (!config) {
      return res.status(400).json({
        error:
          "Invalid type. Must be one of: " + Object.keys(configMap).join(", "),
      });
    }

    const items = await collection
      .aggregate([
        { $group: { _id: config.groupId } },
        { $project: { _id: 0, id: "$_id.id", label: "$_id.label" } },
        { $match: { id: { $ne: null }, label: { $ne: null } } },
        { $sort: { label: 1 } },
      ])
      .toArray();

    res.json({ items });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/years", async (req, res) => {
  try {
    const { view, id } = req.query;
    const collection = db.collection(COLLECTION);
    const match = buildMatchStage(view, id);
    const years = await collection
      .distinct("annee_universitaire", match)
      .then((y) => y.filter((v) => v != null).sort());
    res.json({ years });
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/dashboard", async (req, res) => {
  try {
    const { view, id, year } = req.query;
    if (!view || !VALID_VIEWS.includes(view)) {
      return res.status(400).json({ error: "Invalid or missing view param" });
    }
    const collection = db.collection(COLLECTION);
    const match = buildMatchStage(view, id, year);

    const [
      genderAgg,
      statusAgg,
      disciplineAgg,
      ageAgg,
      categoryAgg,
      establishmentTypeAgg,
      topItems,
      contextInfo,
    ] = await Promise.all([
      collection
        .aggregate([
          { $match: match },
          { $group: { _id: "$sexe", count: { $sum: "$effectif" } } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
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
                  ],
                  default: "non_titulaire",
                },
              },
              count: { $sum: "$effectif" },
            },
          },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                code: "$code_grande_discipline",
                name: "$grande_discipline",
                gender: "$sexe",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: { code: "$_id.code", name: "$_id.name" },
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $sort: { total: -1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { age_class: "$classe_age3", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.age_class",
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { category: "$categorie_assimilation", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.category",
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $match: { _id: { $ne: null } } },
          { $sort: { total: -1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: "$etablissement_type",
              total_count: { $sum: "$effectif" },
            },
          },
          { $match: { _id: { $ne: null } } },
          { $sort: { total_count: -1 } },
        ])
        .toArray(),

      (() => {
        const topGroupConfig = {
          structure: {
            id: "$etablissement_id_paysage",
            label: "$etablissement_lib",
          },
          discipline: {
            id: "$code_grande_discipline",
            label: "$grande_discipline",
          },
          region: {
            id: "$etablissement_region",
            label: "$etablissement_region",
          },
          academie: {
            id: "$etablissement_academie",
            label: "$etablissement_academie",
          },
        };
        const topGroup = topGroupConfig[view];
        const yearMatch = year ? { annee_universitaire: year } : {};
        return collection
          .aggregate([
            { $match: yearMatch },
            {
              $group: {
                _id: {
                  id: topGroup.id,
                  label: topGroup.label,
                  gender: "$sexe",
                },
                count: { $sum: "$effectif" },
              },
            },
            {
              $group: {
                _id: { id: "$_id.id", label: "$_id.label" },
                total: { $sum: "$count" },
                gender_breakdown: {
                  $push: { gender: "$_id.gender", count: "$count" },
                },
              },
            },
            { $sort: { total: -1 } },
            { $limit: 5 },
          ])
          .toArray();
      })(),

      getContextInfo(collection, view, id),
    ]);

    const total_count = genderAgg.reduce((s, g) => s + g.count, 0);

    res.json({
      context_info: contextInfo,
      total_count,
      gender_distribution: genderAgg,
      status_distribution: statusAgg,
      discipline_distribution: disciplineAgg,
      age_distribution: ageAgg,
      category_distribution: categoryAgg,
      establishment_type_distribution: establishmentTypeAgg,
      top_items: topItems,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/evolution", async (req, res) => {
  try {
    const { view, id } = req.query;
    const collection = db.collection(COLLECTION);
    const match = buildMatchStage(view, id);

    const [
      globalEvolution,
      statusEvolution,
      ageEvolution,
      categoryEvolution,
      disciplineEvolution,
      contextInfo,
    ] = await Promise.all([
      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { year: "$annee_universitaire", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
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
              _id: "$_id.year",
              total: { $sum: "$count" },
              status_breakdown: {
                $push: { status: "$_id.status", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                age_class: "$classe_age3",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              age_breakdown: {
                $push: { age_class: "$_id.age_class", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                category: "$categorie_personnels",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              category_breakdown: {
                $push: { category: "$_id.category", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                code: "$code_grande_discipline",
                name: "$grande_discipline",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: { code: "$_id.code", name: "$_id.name" },
              total: { $sum: "$count" },
              yearly: {
                $push: { year: "$_id.year", count: "$count" },
              },
            },
          },
          { $sort: { total: -1 } },
        ])
        .toArray(),

      getContextInfo(collection, view, id),
    ]);

    res.json({
      context_info: contextInfo,
      global_evolution: globalEvolution,
      status_evolution: statusEvolution,
      age_evolution: ageEvolution,
      category_evolution: categoryEvolution,
      discipline_evolution: disciplineEvolution,
    });
  } catch (error) {
    console.error("Error fetching evolution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/research-teachers", async (req, res) => {
  try {
    const { view, id, year } = req.query;
    if (!view || !VALID_VIEWS.includes(view)) {
      return res.status(400).json({ error: "Invalid or missing view param" });
    }
    const collection = db.collection(COLLECTION);
    const match = {
      ...buildMatchStage(view, id, year),
      is_enseignant_chercheur: true,
    };
    const matchAllYears = {
      ...buildMatchStage(view, id),
      is_enseignant_chercheur: true,
    };

    const ageClasses = [
      "35 ans et moins",
      "36 à 55 ans",
      "56 ans et plus",
      "Non précisé",
    ];

    const [
      cnuData,
      categoryDistribution,
      categoryEvolution,
      genderEvolution,
      ageDistribution,
      cnuGroupEvolution,
      contextInfo,
    ] = await Promise.all([
      collection
        .aggregate([
          { $match: match },
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
              categories: { $push: "$categories" },
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
              groupCategories: { $push: "$categories" },
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
                                  in: {
                                    $concatArrays: ["$$value", "$$this"],
                                  },
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
        .toArray(),

      collection
        .aggregate([
          { $match: match },
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
        .toArray(),

      collection
        .aggregate([
          { $match: matchAllYears },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                category: "$categorie_personnels",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              category_breakdown: {
                $push: { category: "$_id.category", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAllYears },
          {
            $group: {
              _id: { year: "$annee_universitaire", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { age_class: "$classe_age3", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.age_class",
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAllYears },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                group_code: "$code_groupe_cnu",
                group_name: "$groupe_cnu",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
              },
              yearly: {
                $push: { year: "$_id.year", count: "$count" },
              },
            },
          },
        ])
        .toArray(),

      getContextInfo(collection, view, id),
    ]);

    res.json({
      context_info: contextInfo,
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
      categoryDistribution: categoryDistribution.map((cat) => ({
        categoryCode: cat._id.category_code,
        categoryName: cat._id.category_name,
        maleCount: cat.maleCount,
        femaleCount: cat.femaleCount,
        totalCount: cat.totalCount,
      })),
      categoryEvolution,
      genderEvolution,
      ageDistribution,
      cnuGroupEvolution,
    });
  } catch (error) {
    console.error("Error fetching research teachers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

async function getComparisonStats(collection, match) {
  const [genderAgg, statusAgg, categoryAgg] = await Promise.all([
    collection
      .aggregate([
        { $match: match },
        { $group: { _id: "$sexe", count: { $sum: "$effectif" } } },
      ])
      .toArray(),
    collection
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: {
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
                ],
                default: "non_titulaire",
              },
            },
            count: { $sum: "$effectif" },
          },
        },
      ])
      .toArray(),
    collection
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: "$categorie_assimilation",
            count: { $sum: "$effectif" },
          },
        },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
  ]);

  const total = genderAgg.reduce((s, g) => s + g.count, 0);
  return { total, gender: genderAgg, status: statusAgg, category: categoryAgg };
}

router.get("/faculty-members/comparison", async (req, res) => {
  try {
    const { view, id, year } = req.query;
    if (!view || !VALID_VIEWS.includes(view) || !id || !year) {
      return res
        .status(400)
        .json({ error: "Missing or invalid view/id/year params" });
    }
    const collection = db.collection(COLLECTION);

    if (view === "structure") {
      const doc = await collection.findOne(
        { etablissement_id_paysage: id },
        {
          projection: {
            etablissement_region: 1,
            etablissement_academie: 1,
            etablissement_actuel_lib: 1,
            etablissement_lib: 1,
          },
        }
      );
      if (!doc) return res.status(404).json({ error: "Structure not found" });

      const regionName = doc.etablissement_region;
      const academieName = doc.etablissement_academie;
      const entityName = doc.etablissement_actuel_lib || doc.etablissement_lib;

      const [entityStats, regionStats, academieStats] = await Promise.all([
        getComparisonStats(collection, {
          etablissement_id_paysage: id,
          annee_universitaire: year,
        }),
        getComparisonStats(collection, {
          etablissement_region: regionName,
          annee_universitaire: year,
        }),
        getComparisonStats(collection, {
          etablissement_academie: academieName,
          annee_universitaire: year,
        }),
      ]);

      return res.json({
        type: "structure",
        entity: { name: entityName, ...entityStats },
        region: { name: regionName, ...regionStats },
        academie: { name: academieName, ...academieStats },
      });
    }

    const geoField =
      view === "region" ? "etablissement_region" : "etablissement_academie";

    const establishments = await collection
      .aggregate([
        { $match: { [geoField]: id, annee_universitaire: year } },
        {
          $group: {
            _id: {
              id: "$etablissement_id_paysage",
              label: "$etablissement_lib",
              gender: "$sexe",
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
            _id: { id: "$_id.id", label: "$_id.label" },
            total: { $sum: "$count" },
            gender_breakdown: {
              $push: { gender: "$_id.gender", count: "$count" },
            },
            status_breakdown: {
              $push: { status: "$_id.status", count: "$count" },
            },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 20 },
      ])
      .toArray();

    const geoStats = await getComparisonStats(collection, {
      [geoField]: id,
      annee_universitaire: year,
    });

    return res.json({
      type: view,
      entity: { name: id, ...geoStats },
      establishments,
    });
  } catch (error) {
    console.error("Error fetching comparison:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/positioning", async (req, res) => {
  try {
    const {
      view = "structure",
      year,
      cnu_type,
      cnu_code,
      assimil_code,
    } = req.query;
    if (!VALID_VIEWS.includes(view)) {
      return res.status(400).json({ error: "Invalid view parameter" });
    }
    const collection = db.collection(COLLECTION);
    const match = {};
    if (year) match.annee_universitaire = year;
    if (cnu_type === "groupe" && cnu_code)
      match.code_groupe_cnu = parseInt(cnu_code);
    if (cnu_type === "section" && cnu_code)
      match.code_section_cnu = parseInt(cnu_code);
    if (assimil_code) match.code_categorie_assimil = assimil_code;

    const groupId = {
      structure: {
        entity_id: "$etablissement_id_paysage_actuel",
        entity_label: "$etablissement_actuel_lib",
        entity_type: "$etablissement_type",
        entity_region: "$etablissement_region",
        entity_code_region: "$etablissement_code_region",
        entity_academie: "$etablissement_academie",
        entity_code_academie: "$etablissement_code_academie",
      },
      region: {
        entity_id: "$etablissement_region",
        entity_label: "$etablissement_region",
        entity_code_region: "$etablissement_code_region",
      },
      academie: {
        entity_id: "$etablissement_academie",
        entity_label: "$etablissement_academie",
        entity_academie: "$etablissement_academie",
        entity_code_academie: "$etablissement_code_academie",
        entity_region: "$etablissement_region",
        entity_code_region: "$etablissement_code_region",
      },
      discipline: {
        entity_id: "$code_grande_discipline",
        entity_label: "$grande_discipline",
      },
    }[view];

    const items = await collection
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: groupId,
            total: { $sum: "$effectif" },
            female: {
              $sum: { $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0] },
            },
            ec: {
              $sum: {
                $cond: [
                  { $eq: ["$is_enseignant_chercheur", true] },
                  "$effectif",
                  0,
                ],
              },
            },
            titulaires: {
              $sum: {
                $cond: [{ $eq: ["$is_titulaire", true] }, "$effectif", 0],
              },
            },
            pr: {
              $sum: {
                $cond: [
                  {
                    $regexMatch: {
                      input: { $ifNull: ["$categorie_assimilation", ""] },
                      regex: "professeur",
                      options: "i",
                    },
                  },
                  "$effectif",
                  0,
                ],
              },
            },
            mcf: {
              $sum: {
                $cond: [
                  {
                    $regexMatch: {
                      input: { $ifNull: ["$categorie_assimilation", ""] },
                      regex: "conf[eé]rences",
                      options: "i",
                    },
                  },
                  "$effectif",
                  0,
                ],
              },
            },
            non_permanents: {
              $sum: {
                $cond: [{ $eq: ["$is_titulaire", false] }, "$effectif", 0],
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
                $cond: [
                  { $eq: ["$classe_age3", "36 à 55 ans"] },
                  "$effectif",
                  0,
                ],
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
            temps_plein: {
              $sum: {
                $cond: [{ $eq: ["$quotite", "Temps plein"] }, "$effectif", 0],
              },
            },
            pers_2nd_degre: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$categorie_assimilation",
                      "Enseignants du 2nd degré et Arts et métiers",
                    ],
                  },
                  "$effectif",
                  0,
                ],
              },
            },
          },
        },
        { $match: { total: { $gt: 0 } } },
        { $sort: { total: -1 } },
      ])
      .toArray();

    const result = items
      .filter((item) => item._id.entity_id && item._id.entity_label)
      .map((item) => ({
        etablissement_id_paysage_actuel: item._id.entity_id,
        etablissement_actuel_lib: item._id.entity_label,
        etablissement_type: item._id.entity_type || null,
        etablissement_region: item._id.entity_region || null,
        etablissement_code_region: item._id.entity_code_region || null,
        etablissement_academie: item._id.entity_academie || null,
        etablissement_code_academie: item._id.entity_code_academie || null,
        total_effectif: item.total,
        taux_feminisation:
          item.total > 0 ? (item.female / item.total) * 100 : 0,
        taux_ec: item.total > 0 ? (item.ec / item.total) * 100 : 0,
        taux_titulaires:
          item.total > 0 ? (item.titulaires / item.total) * 100 : 0,
        taux_non_permanents:
          item.total > 0 ? (item.non_permanents / item.total) * 100 : 0,
        taux_pr: item.total > 0 ? (item.pr / item.total) * 100 : 0,
        taux_mcf: item.total > 0 ? (item.mcf / item.total) * 100 : 0,
        taux_age_35_moins:
          item.total > 0 ? (item.age_35_moins / item.total) * 100 : 0,
        taux_age_36_55:
          item.total > 0 ? (item.age_36_55 / item.total) * 100 : 0,
        taux_age_56_plus:
          item.total > 0 ? (item.age_56_plus / item.total) * 100 : 0,
        taux_temps_plein:
          item.total > 0 ? (item.temps_plein / item.total) * 100 : 0,
        taux_2nd_degre:
          item.total > 0 ? (item.pers_2nd_degre / item.total) * 100 : 0,
        total_titulaires: item.titulaires,
        total_ec: item.ec,
        total_non_permanents: item.non_permanents,
      }));

    res.json({ items: result });
  } catch (error) {
    console.error("Error fetching positioning data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/cnu-list", async (req, res) => {
  try {
    const { year } = req.query;
    const collection = db.collection(COLLECTION);
    const match = {};
    if (year) match.annee_universitaire = year;

    const [groupes, sections] = await Promise.all([
      collection
        .aggregate([
          { $match: { ...match, code_groupe_cnu: { $nin: [99, null] } } },
          {
            $group: { _id: { code: "$code_groupe_cnu", label: "$groupe_cnu" } },
          },
          { $sort: { "_id.code": 1 } },
          { $project: { _id: 0, code: "$_id.code", label: "$_id.label" } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { ...match, code_section_cnu: { $nin: [99, null] } } },
          {
            $group: {
              _id: {
                code: "$code_section_cnu",
                label: "$section_cnu",
                groupe: "$code_groupe_cnu",
              },
            },
          },
          { $sort: { "_id.code": 1 } },
          {
            $project: {
              _id: 0,
              code: "$_id.code",
              label: "$_id.label",
              groupe: "$_id.groupe",
            },
          },
        ])
        .toArray(),
    ]);

    res.json({ groupes, sections });
  } catch (error) {
    console.error("Error fetching CNU list:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/assimilation-list", async (req, res) => {
  try {
    const { year } = req.query;
    const collection = db.collection(COLLECTION);
    const match = {};
    if (year) match.annee_universitaire = year;

    const categories = await collection
      .aggregate([
        { $match: { ...match, code_categorie_assimil: { $ne: null } } },
        {
          $group: {
            _id: {
              code: "$code_categorie_assimil",
              label: "$categorie_assimilation",
            },
          },
        },
        { $sort: { "_id.label": 1 } },
        { $project: { _id: 0, code: "$_id.code", label: "$_id.label" } },
      ])
      .toArray();

    res.json({ categories });
  } catch (error) {
    console.error("Error fetching assimilation list:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
