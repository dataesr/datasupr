import express from "express";
import { db } from "../../../../services/mongo.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/evolutions/national", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { type, typologie, region } = req.query;
    const collection = db.collection("finance-university-main_staging");

    const matchStage = {
      exercice: { $ne: null },
      ...(type ? { type } : {}),
      ...(typologie ? { etablissement_actuel_typologie: typologie } : {}),
      ...(region ? { region } : {}),
    };

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: "$exercice",
          recettes_propres: { $sum: { $ifNull: ["$recettes_propres", 0] } },
          scsp: { $sum: { $ifNull: ["$scsp", 0] } },
          effectif_sans_cpge: { $sum: { $ifNull: ["$effectif_sans_cpge", 0] } },
          emploi_etpt: { $sum: { $ifNull: ["$emploi_etpt", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          exercice: "$_id",
          recettes_propres: 1,
          scsp: 1,
          effectif_sans_cpge: 1,
          emploi_etpt: 1,
        },
      },
      { $sort: { exercice: 1 } },
    ];

    const docs = await collection.aggregate(pipeline).toArray();

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
      const collection = db.collection("finance-university-main_staging");

      const pipeline = [
        {
          $match: {
            $or: [
              { etablissement_id_paysage_actuel: id },
              { etablissement_uai: id },
            ],
            exercice: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$exercice",
            recettes_propres: { $sum: { $ifNull: ["$recettes_propres", 0] } },
            scsp: { $sum: { $ifNull: ["$scsp", 0] } },
          },
        },
        {
          $project: {
            _id: 0,
            annee: "$_id",
            recettes_propres: 1,
            scsp: 1,
          },
        },
        { $sort: { annee: 1 } },
      ];

      const series = await collection.aggregate(pipeline).toArray();
      const payload = { series };

      setCached(key, payload);
      res.json(payload);
    } catch (e) {
      res.status(500).json({ error: "Server error", details: e.message });
    }
  }
);

export default router;
