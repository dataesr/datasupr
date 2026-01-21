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
            etablissement_actuel_region: {
              $first: "$etablissement_actuel_region",
            },
            type: { $first: "$type" },
            etablissement_actuel_type: { $first: "$etablissement_actuel_type" },
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
      etablissement_actuel_region: x.etablissement_actuel_region,
      type: x.type,
      etablissement_actuel_type: x.etablissement_actuel_type,
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
      const { annee, useHistorical } = req.query;
      const collection = db.collection("finance-university-main_staging");

      let matchCondition;
      if (useHistorical === "true") {
        matchCondition = { etablissement_id_paysage: id };
      } else {
        matchCondition = {
          $or: [
            { etablissement_id_paysage: id },
            { etablissement_id_paysage_actuel: id },
          ],
        };
      }

      const matchStage = {
        $match: {
          ...matchCondition,
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
            $or: [
              { etablissement_id_paysage: id },
              { etablissement_id_paysage_actuel: id },
            ],
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

router.get(
  "/structures-finance/etablissements/:id/check-multiples",
  async (req, res) => {
    try {
      const key = cacheKey(req.path, req.query);
      const hit = getCached(key);
      if (hit) return res.json(hit);

      const { id } = req.params;
      const { annee } = req.query;
      const collection = db.collection("finance-university-main_staging");

      const findActuelId = await collection.findOne({
        $or: [
          { etablissement_id_paysage: id },
          { etablissement_id_paysage_actuel: id },
        ],
      });

      if (!findActuelId) {
        const payload = { hasMultiples: false, count: 0, etablissements: [] };
        setCached(key, payload);
        return res.json(payload);
      }

      const actualId = findActuelId.etablissement_id_paysage_actuel;

      const pipeline = [
        {
          $match: {
            etablissement_id_paysage_actuel: actualId,
            ...(annee ? { exercice: Number(annee) } : {}),
          },
        },
        {
          $group: {
            _id: "$etablissement_id_paysage",
            etablissement_lib: { $first: "$etablissement_lib" },
            etablissement_id_paysage_actuel: {
              $first: "$etablissement_id_paysage_actuel",
            },
            etablissement_actuel_lib: { $first: "$etablissement_actuel_lib" },
            type: { $first: "$type" },
            typologie: { $first: "$typologie" },
            exercice: { $first: "$exercice" },
            date_de_creation: { $first: "$date_de_creation" },
            date_de_fermeture: { $first: "$date_de_fermeture" },
            effectif_sans_cpge: { $first: "$effectif_sans_cpge" },
          },
        },
        { $sort: { etablissement_lib: 1 } },
      ];

      const docs = await collection.aggregate(pipeline).toArray();

      const payload = {
        hasMultiples: docs.length > 1,
        count: docs.length,
        etablissements: docs.map((doc) => ({
          etablissement_id_paysage: doc._id,
          etablissement_lib: doc.etablissement_lib,
          etablissement_id_paysage_actuel: doc.etablissement_id_paysage_actuel,
          etablissement_actuel_lib: doc.etablissement_actuel_lib,
          type: doc.type,
          typologie: doc.typologie,
          exercice: doc.exercice,
          date_de_creation: doc.date_de_creation,
          date_de_fermeture: doc.date_de_fermeture,
          effectif_sans_cpge: doc.effectif_sans_cpge,
        })),
      };

      setCached(key, payload);
      res.json(payload);
    } catch (e) {
      res.status(500).json({ error: "Server error", details: e.message });
    }
  }
);

router.get(
  "/structures-finance/etablissements/:id/check-exists",
  async (req, res) => {
    try {
      const key = cacheKey(req.path, req.query);
      const hit = getCached(key);
      if (hit) return res.json(hit);

      const { id } = req.params;
      const { annee } = req.query;
      const collection = db.collection("finance-university-main_staging");

      const existsForYear = await collection.findOne({
        $or: [
          { etablissement_id_paysage: id },
          { etablissement_id_paysage_actuel: id },
        ],
        ...(annee ? { exercice: Number(annee) } : {}),
      });

      if (existsForYear) {
        const payload = {
          exists: true,
          etablissement_id_paysage: existsForYear.etablissement_id_paysage,
          etablissement_lib: existsForYear.etablissement_lib,
        };
        setCached(key, payload);
        return res.json(payload);
      }

      const historicalDoc = await collection.findOne({
        $or: [
          { etablissement_id_paysage: id },
          { etablissement_id_paysage_actuel: id },
        ],
      });

      if (!historicalDoc) {
        const payload = {
          exists: false,
          etablissementActuel: null,
        };
        setCached(key, payload);
        return res.json(payload);
      }

      const currentDoc = await collection.findOne({
        etablissement_id_paysage: historicalDoc.etablissement_id_paysage_actuel,
        ...(annee ? { exercice: Number(annee) } : {}),
      });

      const payload = {
        exists: false,
        etablissement_lib_historique: historicalDoc.etablissement_lib,
        etablissementActuel: currentDoc
          ? {
              etablissement_id_paysage: currentDoc.etablissement_id_paysage,
              etablissement_id_paysage_actuel:
                currentDoc.etablissement_id_paysage_actuel,
              etablissement_lib: currentDoc.etablissement_lib,
              etablissement_actuel_lib: currentDoc.etablissement_actuel_lib,
            }
          : {
              etablissement_id_paysage:
                historicalDoc.etablissement_id_paysage_actuel,
              etablissement_id_paysage_actuel:
                historicalDoc.etablissement_id_paysage_actuel,
              etablissement_lib: historicalDoc.etablissement_actuel_lib,
              etablissement_actuel_lib: historicalDoc.etablissement_actuel_lib,
            },
      };

      setCached(key, payload);
      res.json(payload);
    } catch (e) {
      res.status(500).json({ error: "Server error", details: e.message });
    }
  }
);

export default router;
