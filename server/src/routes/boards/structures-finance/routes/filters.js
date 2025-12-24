import express from "express";
import { db } from "../../../../services/mongo.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/filters/years", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const collection = db.collection("finance-university-main_staging");
    const years = await collection
      .aggregate([
        { $match: { exercice: { $ne: null } } },
        { $group: { _id: "$exercice" } },
        { $sort: { _id: -1 } },
      ])
      .toArray();

    const payload = { years: years.map((x) => x._id) };
    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

router.get("/structures-finance/comparisons/filters", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee } = req.query;
    const collection = db.collection("finance-university-main_staging");
    const matchStage = annee ? { exercice: Number(annee) } : {};

    const [regions, types, typologies] = await Promise.all([
      collection
        .aggregate([
          { $match: matchStage },
          { $group: { _id: "$region" } },
          { $match: { _id: { $ne: null } } },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: matchStage },
          { $group: { _id: "$type" } },
          { $match: { _id: { $ne: null } } },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: matchStage },
          { $group: { _id: "$etablissement_actuel_typologie" } },
          { $match: { _id: { $ne: null } } },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
    ]);

    const payload = {
      regions: regions.map((x) => x._id),
      types: types.map((x) => x._id),
      typologies: typologies.map((x) => x._id),
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
