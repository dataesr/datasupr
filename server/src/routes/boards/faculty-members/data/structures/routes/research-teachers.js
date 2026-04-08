import { Router } from "express";
import {
  getCollection,
  buildMatchStage,
  getContextInfo,
  VALID_VIEWS,
} from "../helpers.js";

const router = Router();

const AGE_CLASSES = [
  "35 ans et moins",
  "36 à 55 ans",
  "56 ans et plus",
  "Non précisé",
];

function flattenGenderRows(genderRows) {
  return {
    $map: {
      input: ["Féminin", "Masculin"],
      as: "g",
      in: {
        gender: "$$g",
        count: {
          $sum: {
            $map: {
              input: {
                $reduce: {
                  input: genderRows,
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              },
              as: "row",
              in: {
                $cond: [{ $eq: ["$$row.gender", "$$g"] }, "$$row.count", 0],
              },
            },
          },
        },
      },
    },
  };
}

function aggregateCategories() {
  return {
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
                          in: { $concatArrays: ["$$value", "$$this"] },
                        },
                      },
                      as: "cat",
                      cond: { $eq: ["$$cat.categoryName", "$$catName"] },
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
  };
}

router.get("/faculty-members/research-teachers", async (req, res) => {
  try {
    const { view, id, year } = req.query;
    if (!view || !VALID_VIEWS.includes(view)) {
      return res.status(400).json({ error: "Invalid or missing view param" });
    }
    const collection = getCollection();
    const match = {
      ...buildMatchStage(view, id, year),
      is_enseignant_chercheur: true,
    };
    const matchAllYears = {
      ...buildMatchStage(view, id),
      is_enseignant_chercheur: true,
    };

    const [
      cnuData,
      categoryDistribution,
      categoryAssimilEvolution,
      categoryAgeEvolution,
      categoryEvolution,
      genderEvolution,
      ageDistribution,
      cnuGroupEvolution,
      cnuSectionEvolution,
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
                $push: { categoryName: "$_id.category_name", count: "$count" },
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
                $push: { ageClass: "$_id.age_class", count: "$totalCount" },
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
          { $addFields: { categories: aggregateCategories() } },
          { $project: { groupCategories: 0 } },
          {
            $addFields: {
              ageDistribution: AGE_CLASSES.map((ageClass) => ({
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
                age_class: "$classe_age3",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                category_code: "$_id.category_code",
                category_name: "$_id.category_name",
                age_class: "$_id.age_class",
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
          {
            $group: {
              _id: {
                category_code: "$_id.category_code",
                category_name: "$_id.category_name",
              },
              totalCount: { $sum: "$totalCount" },
              maleCount: { $sum: "$maleCount" },
              femaleCount: { $sum: "$femaleCount" },
              ageDistribution: {
                $push: { ageClass: "$_id.age_class", count: "$totalCount" },
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
                year: "$_id.year",
                category_code: "$_id.category_code",
                category_name: "$_id.category_name",
              },
              count: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          {
            $group: {
              _id: {
                category_code: "$_id.category_code",
                category_name: "$_id.category_name",
              },
              yearly: {
                $push: {
                  year: "$_id.year",
                  count: "$count",
                  gender_breakdown: "$gender_breakdown",
                },
              },
            },
          },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAllYears },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                category_code: "$code_categorie_assimil",
                category_name: "$categorie_assimilation",
                age_class: "$classe_age3",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                category_code: "$_id.category_code",
                category_name: "$_id.category_name",
                age_class: "$_id.age_class",
              },
              yearly: { $push: { year: "$_id.year", count: "$count" } },
            },
          },
          {
            $group: {
              _id: {
                category_code: "$_id.category_code",
                category_name: "$_id.category_name",
              },
              age_classes: {
                $push: { age_class: "$_id.age_class", yearly: "$yearly" },
              },
            },
          },
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
                gender: "$sexe",
                age_class: "$classe_age3",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
                age_class: "$_id.age_class",
              },
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
              },
              total: { $sum: "$total" },
              age_breakdown: {
                $push: { age_class: "$_id.age_class", count: "$total" },
              },
              gender_rows: { $push: "$gender_breakdown" },
            },
          },
          {
            $addFields: { gender_breakdown: flattenGenderRows("$gender_rows") },
          },
          {
            $group: {
              _id: {
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
              },
              yearly: {
                $push: {
                  year: "$_id.year",
                  count: "$total",
                  gender_breakdown: "$gender_breakdown",
                  age_breakdown: "$age_breakdown",
                },
              },
            },
          },
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
                section_code: "$code_section_cnu",
                section_name: "$section_cnu",
                gender: "$sexe",
                age_class: "$classe_age3",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                group_code: "$_id.group_code",
                section_code: "$_id.section_code",
                section_name: "$_id.section_name",
                age_class: "$_id.age_class",
              },
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          {
            $group: {
              _id: {
                year: "$_id.year",
                group_code: "$_id.group_code",
                section_code: "$_id.section_code",
                section_name: "$_id.section_name",
              },
              total: { $sum: "$total" },
              age_breakdown: {
                $push: { age_class: "$_id.age_class", count: "$total" },
              },
              gender_rows: { $push: "$gender_breakdown" },
            },
          },
          {
            $addFields: { gender_breakdown: flattenGenderRows("$gender_rows") },
          },
          {
            $group: {
              _id: {
                group_code: "$_id.group_code",
                section_code: "$_id.section_code",
                section_name: "$_id.section_name",
              },
              yearly: {
                $push: {
                  year: "$_id.year",
                  count: "$total",
                  gender_breakdown: "$gender_breakdown",
                  age_breakdown: "$age_breakdown",
                },
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
          ageDistribution: AGE_CLASSES.map((ageClass) => ({
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
        ageDistribution: AGE_CLASSES.map((ageClass) => ({
          ageClass,
          count:
            cat.ageDistribution?.find((a) => a.ageClass === ageClass)?.count ||
            0,
        })),
      })),
      categoryAssimilEvolution,
      categoryAgeEvolution,
      categoryEvolution,
      genderEvolution,
      ageDistribution,
      cnuGroupEvolution,
      cnuSectionEvolution,
    });
  } catch (error) {
    console.error("Error fetching research teachers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
