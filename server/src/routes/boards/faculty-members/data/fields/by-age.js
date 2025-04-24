import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-age-distribution", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-fields");
    const { annee } = req.query;

    const pipeline = [];

    if (annee) {
      pipeline.push({ $match: { academic_year: annee } });
    }

    pipeline.push({ $unwind: "$headcount_per_fields" });

    pipeline.push({
      $group: {
        _id: {
          year: "$academic_year",
          fieldId: "$headcount_per_fields.field_id",
          fieldLabel: "$headcount_per_fields.field_label",
          ageClass: "$age_class",
        },
        countForAgeClass: {
          $sum: {
            $add: [
              "$headcount_per_fields.numberWoman",
              "$headcount_per_fields.numberMan",
              { $ifNull: ["$headcount_per_fields.numberUnknown", 0] },
            ],
          },
        },
      },
    });

    pipeline.push({
      $group: {
        _id: {
          year: "$_id.year",
          fieldId: "$_id.fieldId",
          fieldLabel: "$_id.fieldLabel",
        },
        totalCount: { $sum: "$countForAgeClass" },
        ageDistributionRaw: {
          $push: {
            ageClass: "$_id.ageClass",
            count: "$countForAgeClass",
          },
        },
      },
    });

    pipeline.push({
      $addFields: {
        ageDistribution: {
          $map: {
            input: "$ageDistributionRaw",
            as: "ageGroup",
            in: {
              ageClass: "$$ageGroup.ageClass",
              count: "$$ageGroup.count",
              percent: {
                $cond: [
                  { $eq: ["$totalCount", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$$ageGroup.count", "$totalCount"] },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    });

    pipeline.push({
      $project: {
        _id: 0,
        year: "$_id.year",
        fieldId: "$_id.fieldId",
        fieldLabel: "$_id.fieldLabel",
        totalCount: 1,
        ageDistribution: {
          $sortArray: { input: "$ageDistribution", sortBy: { ageClass: 1 } },
        },
      },
    });

    pipeline.push({
      $sort: { year: -1, fieldLabel: 1 },
    });

    const result = await collection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("Erreur dans /faculty-members-age-distribution:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

export default router;
