import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-overview-university-data", async (req, res) => {
  try {
    const { university_id, year } = req.query;

    const years = await db
      .collection("teaching-staff-university-summary")
      .distinct("academic_year");

    const yearsArray = years.sort();
    const latestYear = yearsArray[yearsArray.length - 1];

    if (university_id) {
      const targetYear = year || latestYear;

      const universityData = await db
        .collection("teaching-staff-university-summary")
        .findOne({
          university_id: university_id,
          academic_year: targetYear,
        });

      if (!universityData) {
        return res.status(404).json({
          message: `Aucune donnée trouvée pour cette université pour l'année ${targetYear}`,
        });
      }

      return res.json({
        available_years: yearsArray,
        data: universityData,
      });
    }

    const annualSummary = await db
      .collection("teaching-staff-university-summary")
      .aggregate([
        {
          $match: year ? { academic_year: year } : {},
        },
        {
          $group: {
            _id: "$academic_year",
            establishment_count: { $sum: 1 },
            total_headcount: { $sum: "$total_stats.total_headcount" },
            woman_count: { $sum: "$total_stats.woman_count" },
            man_count: { $sum: "$total_stats.man_count" },
            titular_count: { $sum: "$total_stats.titular_count" },
            researcher_count: { $sum: "$total_stats.researcher_count" },
          },
        },
        {
          $project: {
            _id: 0,
            academic_year: "$_id",
            establishment_count: 1,
            total_headcount: 1,
            woman_count: 1,
            man_count: 1,
            titular_count: 1,
            researcher_count: 1,
            woman_percentage: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$woman_count", "$total_headcount"] },
                    100,
                  ],
                },
                1,
              ],
            },
            man_percentage: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$man_count", "$total_headcount"] },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
        { $sort: { academic_year: 1 } },
      ])
      .toArray();

    const universities = await db
      .collection("teaching-staff-university-summary")
      .aggregate([
        {
          $group: {
            _id: "$university_id",
            geo_name: { $first: "$university_name" },
          },
        },
        {
          $project: {
            _id: 0,
            geo_id: "$_id",
            geo_name: 1,
          },
        },
        { $sort: { geo_name: 1 } },
      ])
      .toArray();

    const fieldDistribution = await db
      .collection("teaching-staff-university-summary")
      .aggregate([
        { $match: { academic_year: year || latestYear } },
        { $unwind: "$fields_summary" },
        {
          $group: {
            _id: {
              field_id: "$fields_summary.field_id",
              field_label: "$fields_summary.field_label",
            },
            totalCount: {
              $sum: {
                $add: [
                  "$fields_summary.numberWoman",
                  "$fields_summary.numberMan",
                  "$fields_summary.numberUnknown",
                ],
              },
            },
            womanCount: { $sum: "$fields_summary.numberWoman" },
            manCount: { $sum: "$fields_summary.numberMan" },
          },
        },
        {
          $project: {
            _id: 0,
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
            count: "$totalCount",
            womanCount: 1,
            manCount: 1,
            percentage: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$totalCount", { $sum: "$totalCount" }] },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    return res.json({
      available_years: yearsArray,
      latest_year: latestYear,
      universities: universities,
      annual_summary: annualSummary,
      field_distribution: fieldDistribution,
    });
  } catch (error) {
    console.error("Erreur API (university-data):", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
