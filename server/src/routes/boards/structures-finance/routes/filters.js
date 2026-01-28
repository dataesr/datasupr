import express from "express";
import { getDistinctValues } from "./ods-client.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/filters/years", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const years = await getDistinctValues("exercice", {
      exercice: { $ne: null },
    });

    const sortedYears = years.sort((a, b) => b - a);

    const payload = { years: sortedYears };
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
    const whereCondition = annee ? { exercice: Number(annee) } : {};

    const [regions, types, typologies] = await Promise.all([
      getDistinctValues("region", whereCondition),
      getDistinctValues("type", whereCondition),
      getDistinctValues("etablissement_actuel_typologie", whereCondition),
    ]);

    const payload = {
      regions: regions.sort(),
      types: types.sort(),
      typologies: typologies.sort(),
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
