import express from "express";
import { fetchRecords } from "./ods-client.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/evolutions/national", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { type, typologie, region } = req.query;

    const whereCondition = {
      exercice: { $ne: null },
    };
    if (type) whereCondition.type = type;
    if (typologie) whereCondition.etablissement_actuel_typologie = typologie;
    if (region) whereCondition.region = region;

    const docs = await fetchRecords({
      select: [
        "exercice",
        "SUM(recettes_propres) as recettes_propres",
        "SUM(scsp) as scsp",
        "SUM(effectif_sans_cpge) as effectif_sans_cpge",
        "SUM(emploi_etpt) as emploi_etpt",
      ],
      where: whereCondition,
      groupBy: ["exercice"],
      orderBy: "exercice ASC",
      limit: 100,
    });

    setCached(key, docs);
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

router.get(
  "/structures-finance/evolutions/etablissement/:id",
  async (req, res) => {
    try {
      const key = cacheKey(req.path, req.query);
      const hit = getCached(key);
      if (hit) return res.json(hit);

      const { id } = req.params;

      const whereCondition = {
        $or: [
          { etablissement_id_paysage_actuel: id },
          { etablissement_uai: id },
        ],
        exercice: { $ne: null },
      };

      const series = await fetchRecords({
        select: [
          "exercice as annee",
          "SUM(recettes_propres) as recettes_propres",
          "SUM(scsp) as scsp",
        ],
        where: whereCondition,
        groupBy: ["exercice"],
        orderBy: "exercice ASC",
        limit: 100,
      });

      const payload = { series };

      setCached(key, payload);
      res.json(payload);
    } catch (e) {
      res.status(500).json({ error: "Server error", details: e.message });
    }
  }
);

export default router;
