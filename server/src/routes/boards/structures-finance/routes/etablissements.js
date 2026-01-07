import express from "express";
import { db } from "../../../../services/mongo.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/etablissements", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee } = req.query;
    const collection = db.collection("finance-university-main_staging");
    const matchStage = annee ? { exercice: Number(annee) } : {};

    const items = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$etablissement_id_paysage",
            etablissement_lib: { $first: "$etablissement_lib" },
            etablissement_id_paysage_actuel: {
              $first: "$etablissement_id_paysage_actuel",
            },
            etablissement_actuel_lib: { $first: "$etablissement_actuel_lib" },
            region: { $first: "$region" },
            type: { $first: "$type" },
            typologie: { $first: "$etablissement_actuel_typologie" },
          },
        },
        { $sort: { etablissement_lib: 1 } },
      ])
      .toArray();

    const payload = items.map((x) => ({
      id: x._id,
      etablissement_id_paysage: x._id,
      nom: x.etablissement_lib,
      etablissement_lib: x.etablissement_lib,
      id_actuel: x.etablissement_id_paysage_actuel,
      etablissement_id_paysage_actuel: x.etablissement_id_paysage_actuel,
      nom_actuel: x.etablissement_actuel_lib,
      etablissement_actuel_lib: x.etablissement_actuel_lib,
      region: x.region,
      etablissement_actuel_region: x.region,
      type: x.type,
      etablissement_actuel_type: x.type,
      typologie: x.typologie,
      etablissement_actuel_typologie: x.typologie,
    }));

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

router.get(
  "/structures-finance/etablissements/:id/detail",
  async (req, res) => {
    try {
      const key = cacheKey(req.path, req.query);
      const hit = getCached(key);
      if (hit) return res.json(hit);

      const { id } = req.params;
      const { annee } = req.query;
      const collection = db.collection("finance-university-main_staging");

      const matchStage = {
        $match: {
          etablissement_id_paysage: id,
          ...(annee ? { exercice: Number(annee) } : {}),
        },
      };

      const pipeline = [matchStage, { $sort: { exercice: -1 } }, { $limit: 1 }];
      const [doc] = await collection.aggregate(pipeline).toArray();

      setCached(key, doc);
      res.json(doc || null);
    } catch (e) {
      res.status(500).json({ error: "Server error", details: e.message });
    }
  }
);

router.get(
  "/structures-finance/etablissements/:id/overview",
  async (req, res) => {
    try {
      const key = cacheKey(req.path, req.query);
      const hit = getCached(key);
      if (hit) return res.json(hit);

      const { id } = req.params;
      const { annee } = req.query;
      const collection = db.collection("finance-university-main_staging");

      const pipeline = [
        {
          $match: {
            $or: [
              { etablissement_id_paysage_actuel: id },
              { etablissement_uai: id },
            ],
            ...(annee ? { exercice: Number(annee) } : {}),
          },
        },
        {
          $project: {
            _id: 1,
            etablissement_id_paysage: 1,
            etablissement_id_paysage_actuel: 1,
            etablissement_actuel_lib: 1,
            recettes_propres: 1,
            scsp: 1,
            region: 1,
            scsp_par_etudiants: 1,
            effectif_sans_cpge: 1,
            etablissement_actuel_typologie: 1,
          },
        },
        { $sort: { exercice: -1 } },
        { $limit: 1 },
      ];

      const [doc] = await collection.aggregate(pipeline).toArray();

      setCached(key, doc);
      res.json(doc || null);
    } catch (e) {
      res.status(500).json({ error: "Server error", details: e.message });
    }
  }
);

router.get(
  "/structures-finance/etablissements/:id/evolution",
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
            etablissement_id_paysage: id,
            exercice: { $ne: null },
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
  }
);

export default router;
