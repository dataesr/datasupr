import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-research-teachers-by-fields", async (req, res) => {
  try {
    const collection = db.collection(
      "teaching-staff-research-teachers-by-fields"
    );
    // ATTENTION !! ON FAIT LA MÊME CHOSE POUR LES GROUPS CNU ET LES SECTIONS CNU !!

    //  Et aussi ; dans les sections CNU il n'y a que les enseignants-chercheurs
    const { annee, fieldId } = req.query;
    const pipeline = [];

    if (annee) {
      pipeline.push({ $match: { year: annee } });
    } else {
      const latestYear = await collection
        .aggregate([
          { $sort: { year: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, year: 1 } },
        ])
        .toArray();

      if (latestYear.length > 0) {
        pipeline.push({ $match: { year: latestYear[0].year } });
      } else {
        return res.status(404).json({ error: "Aucune donnée disponible" });
      }
    }

    if (fieldId) {
      pipeline.push({ $match: { fieldId: fieldId } });
    }

    pipeline.push(
      {
        $project: {
          _id: 0,
          year: 1,
          fieldId: 1,
          fieldLabel: 1,
          totalCount: 1,
          maleCount: 1,
          femaleCount: 1,
          unknownCount: 1,
          ageDistribution: 1,
          cnuGroups: {
            $map: {
              input: "$cnuGroups",
              as: "group",
              in: {
                cnuGroupId: "$$group.cnuGroupId",
                cnuGroupLabel: "$$group.cnuGroupLabel",
                totalCount: "$$group.totalCount",
                maleCount: "$$group.maleCount",
                femaleCount: "$$group.femaleCount",
                unknownCount: "$$group.unknownCount",
                ageDistribution: "$$group.ageDistribution",
                genderRatio: {
                  femalePercent: "$$group.genderRatio.female_percent",
                  malePercent: "$$group.genderRatio.male_percent",
                  gap: "$$group.genderRatio.gap",
                },
                cnuSections: {
                  $map: {
                    input: "$$group.cnuSections",
                    as: "section",
                    in: {
                      cnuSectionId: "$$section.cnuSectionId",
                      cnuSectionLabel: "$$section.cnuSectionLabel",
                      totalCount: "$$section.totalCount",
                      maleCount: "$$section.maleCount",
                      femaleCount: "$$section.femaleCount",
                      ageDistribution: "$$section.ageDistribution",
                    },
                  },
                },
              },
            },
          },
          genderRatio: {
            femalePercent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$femaleCount", { $max: ["$totalCount", 1] }] },
                    100,
                  ],
                },
                1,
              ],
            },
            malePercent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$maleCount", { $max: ["$totalCount", 1] }] },
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
                          $divide: ["$maleCount", { $max: ["$totalCount", 1] }],
                        },
                        100,
                      ],
                    },
                    {
                      $multiply: [
                        {
                          $divide: [
                            "$femaleCount",
                            { $max: ["$totalCount", 1] },
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
          last_updated: 1,
        },
      },
      { $sort: { fieldId: 1 } }
    );

    const result = await collection.aggregate(pipeline).toArray();

    if (!fieldId && result.length > 0) {
      const totalCount = result.reduce((sum, item) => sum + item.totalCount, 0);
      const maleCount = result.reduce((sum, item) => sum + item.maleCount, 0);
      const femaleCount = result.reduce(
        (sum, item) => sum + item.femaleCount,
        0
      );
      const unknownCount = result.reduce(
        (sum, item) => sum + (item.unknownCount || 0),
        0
      );

      const femalePercent =
        Math.round((femaleCount / totalCount) * 100 * 10) / 10;
      const malePercent = Math.round((maleCount / totalCount) * 100 * 10) / 10;
      const gap = Math.round((malePercent - femalePercent) * 10) / 10;

      const globalAgeDistribution = [];
      const ageClasses = ["35 ans et moins", "36 à 55 ans", "56 ans et plus"];

      ageClasses.forEach((ageClass) => {
        const totalForAge = result.reduce((sum, discipline) => {
          const ageCategoryData = discipline.ageDistribution?.find(
            (age) => age.ageClass === ageClass
          );
          return sum + (ageCategoryData?.count || 0);
        }, 0);

        const maleForAge = result.reduce((sum, discipline) => {
          const ageCategoryData = discipline.ageDistribution?.find(
            (age) => age.ageClass === ageClass
          );
          return sum + (ageCategoryData?.maleCount || 0);
        }, 0);

        const femaleForAge = result.reduce((sum, discipline) => {
          const ageCategoryData = discipline.ageDistribution?.find(
            (age) => age.ageClass === ageClass
          );
          return sum + (ageCategoryData?.femaleCount || 0);
        }, 0);

        globalAgeDistribution.push({
          ageClass,
          count: totalForAge,
          percent: Math.round((totalForAge / totalCount) * 100 * 10) / 10,
          maleCount: maleForAge,
          femaleCount: femaleForAge,
        });
      });

      const allCnuGroups = [];
      result.forEach((discipline) => {
        if (discipline.cnuGroups && discipline.cnuGroups.length > 0) {
          discipline.cnuGroups.forEach((group) => {
            allCnuGroups.push({
              ...group,
              fieldId: discipline.fieldId,
              fieldLabel: discipline.fieldLabel,
            });
          });
        }
      });

      const globalData = {
        year: result[0].year,
        fieldId: "total",
        fieldLabel: "Toutes disciplines",
        totalCount,
        maleCount,
        femaleCount,
        unknownCount,
        ageDistribution: globalAgeDistribution,
        genderRatio: {
          femalePercent,
          malePercent,
          gap,
        },
        cnuGroups: [],
        fields: result,
      };

      res.json(globalData);
    } else {
      res.json(result.length === 1 ? result[0] : result);
    }
  } catch (err) {
    console.error(
      "Erreur dans /faculty-members-research-teachers-by-fields:",
      err
    );
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

export default router;
