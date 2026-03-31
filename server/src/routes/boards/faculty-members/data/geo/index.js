import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/geo/map-data", async (req, res) => {
  try {
    const { annee_universitaire, level = "region" } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;

    const isAcademie = level === "academie";
    const codeField = isAcademie
      ? "$etablissement_code_academie"
      : "$etablissement_code_region";
    const nameField = isAcademie
      ? "$etablissement_academie"
      : "$etablissement_region";

    const mapData = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: codeField,
              geo_name: nameField,
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
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
        {
          $match: {
            "_id.geo_code": { $ne: null },
            "_id.geo_name": { $ne: null },
          },
        },
        {
          $project: {
            _id: 0,
            geo_id: "$_id.geo_code",
            geo_nom: "$_id.geo_name",
            total_count: 1,
            gender_breakdown: 1,
            male_count: {
              $reduce: {
                input: "$gender_breakdown",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$this.gender", "Masculin"] },
                    { $add: ["$$value", "$$this.count"] },
                    "$$value",
                  ],
                },
              },
            },
            female_count: {
              $reduce: {
                input: "$gender_breakdown",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$this.gender", "Féminin"] },
                    { $add: ["$$value", "$$this.count"] },
                    "$$value",
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            male_percent: {
              $cond: [
                { $gt: ["$total_count", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$male_count", "$total_count"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
                0,
              ],
            },
            female_percent: {
              $cond: [
                { $gt: ["$total_count", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$female_count", "$total_count"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
                0,
              ],
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    const globalStats = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total_count: { $sum: "$effectif" },
            max_region_count: { $max: "$effectif" },
            min_region_count: { $min: "$effectif" },
          },
        },
      ])
      .toArray();

    const regionCounts = mapData
      .map((region) => region.total_count)
      .sort((a, b) => b - a);
    const stats = {
      total_count: globalStats[0]?.total_count || 0,
      max_region_count: Math.max(...regionCounts),
      min_region_count: Math.min(...regionCounts),
      p75: regionCounts[Math.floor(regionCounts.length * 0.25)] || 0,
      p50: regionCounts[Math.floor(regionCounts.length * 0.5)] || 0,
      p25: regionCounts[Math.floor(regionCounts.length * 0.75)] || 0,
      regions_count: regionCounts.length,
    };

    res.json({
      regions: mapData,
      statistics: stats,
      level: level,
      annee_universitaire: annee_universitaire || "Toutes les années",
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    res.status(500).json({
      error: "Server error while fetching map data",
      details: error.message,
    });
  }
});


export default router;
