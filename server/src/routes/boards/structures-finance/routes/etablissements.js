import express from "express";
import { fetchRecords, fetchAllRecords } from "./ods-client.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/etablissements", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee } = req.query;
    const whereCondition = annee ? { exercice: Number(annee) } : {};

    const items = await fetchAllRecords({
      select: [
        "etablissement_id_paysage",
        "etablissement_lib",
        "etablissement_id_paysage_actuel",
        "etablissement_actuel_lib",
        "region",
        "etablissement_actuel_region",
        "type",
        "etablissement_actuel_type",
        "etablissement_actuel_typologie",
      ],
      where: whereCondition,
      groupBy: [
        "etablissement_id_paysage",
        "etablissement_lib",
        "etablissement_id_paysage_actuel",
        "etablissement_actuel_lib",
        "region",
        "etablissement_actuel_region",
        "type",
        "etablissement_actuel_type",
        "etablissement_actuel_typologie",
      ],
      orderBy: "etablissement_lib ASC",
    });

    const payload = items.map((x) => ({
      id: x.etablissement_id_paysage,
      etablissement_id_paysage: x.etablissement_id_paysage,
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
      typologie: x.etablissement_actuel_typologie,
      etablissement_actuel_typologie: x.etablissement_actuel_typologie,
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

      let whereCondition;
      if (useHistorical === "true") {
        whereCondition = { etablissement_id_paysage: id };
      } else {
        whereCondition = {
          $or: [
            { etablissement_id_paysage: id },
            { etablissement_id_paysage_actuel: id },
          ],
        };
      }

      if (annee) {
        whereCondition.exercice = Number(annee);
      }

      const records = await fetchRecords({
        where: whereCondition,
        orderBy: "exercice DESC",
        limit: 1,
      });

      const doc = records.length > 0 ? records[0] : null;

      if (doc && doc.implantations && typeof doc.implantations === "string") {
        try {
          doc.implantations = JSON.parse(doc.implantations);
        } catch (e) {
          console.error("Error parsing implantations:", e);
          doc.implantations = [];
        }
      }

      setCached(key, doc);
      res.json(doc);
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

      const whereCondition = {
        $or: [{ etablissement_id_paysage_actuel: id }],
      };

      if (annee) {
        whereCondition.exercice = Number(annee);
      }

      const records = await fetchRecords({
        select: [
          "etablissement_id_paysage",
          "etablissement_id_paysage_actuel",
          "etablissement_actuel_lib",
          "recettes_propres",
          "scsp",
          "region",
          "scsp_par_etudiants",
          "effectif_sans_cpge",
          "etablissement_actuel_typologie",
        ],
        where: whereCondition,
        orderBy: "exercice DESC",
        limit: 1,
      });

      const doc = records.length > 0 ? records[0] : null;

      setCached(key, doc);
      res.json(doc);
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

      const whereCondition = {
        $or: [
          { etablissement_id_paysage: id },
          { etablissement_id_paysage_actuel: id },
        ],
        exercice: { $ne: null },
      };

      const docs = await fetchAllRecords({
        where: whereCondition,
        orderBy: "exercice ASC",
      });

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

      const [findActuelRecord] = await fetchRecords({
        where: {
          $or: [
            { etablissement_id_paysage: id },
            { etablissement_id_paysage_actuel: id },
          ],
        },
        limit: 1,
      });

      if (!findActuelRecord) {
        const payload = { hasMultiples: false, count: 0, etablissements: [] };
        setCached(key, payload);
        return res.json(payload);
      }

      const actualId = findActuelRecord.etablissement_id_paysage_actuel;

      const whereCondition = {
        etablissement_id_paysage_actuel: actualId,
      };

      if (annee) {
        whereCondition.exercice = Number(annee);
      }

      const docs = await fetchAllRecords({
        select: [
          "etablissement_id_paysage",
          "etablissement_lib",
          "etablissement_id_paysage_actuel",
          "etablissement_actuel_lib",
          "etablissement_categorie",
          "type",
          "etablissement_actuel_typologie",
          "exercice",
          "date_de_creation",
          "date_de_fermeture",
          "effectif_sans_cpge",
          "anuniv",
        ],
        where: whereCondition,
        groupBy: [
          "etablissement_id_paysage",
          "etablissement_lib",
          "etablissement_id_paysage_actuel",
          "etablissement_actuel_lib",
          "type",
          "etablissement_categorie",
          "etablissement_actuel_typologie",
          "exercice",
          "date_de_creation",
          "date_de_fermeture",
          "effectif_sans_cpge",
          "anuniv",
        ],
        orderBy: "etablissement_lib ASC",
      });

      const payload = {
        hasMultiples: docs.length > 1,
        count: docs.length,
        etablissements: docs.map((doc) => ({
          etablissement_id_paysage: doc.etablissement_id_paysage,
          etablissement_lib: doc.etablissement_lib,
          etablissement_id_paysage_actuel: doc.etablissement_id_paysage_actuel,
          etablissement_actuel_lib: doc.etablissement_actuel_lib,
          etablissement_categorie: doc.etablissement_categorie,
          type: doc.type,
          typologie: doc.etablissement_actuel_typologie,
          exercice: doc.exercice,
          date_de_creation: doc.date_de_creation,
          date_de_fermeture: doc.date_de_fermeture,
          effectif_sans_cpge: doc.effectif_sans_cpge,
          anuniv: doc.anuniv,
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

      const whereForYear = {
        $or: [
          { etablissement_id_paysage: id },
          { etablissement_id_paysage_actuel: id },
        ],
      };

      if (annee) {
        whereForYear.exercice = Number(annee);
      }

      const [existsForYear] = await fetchRecords({
        where: whereForYear,
        limit: 1,
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

      const [historicalDoc] = await fetchRecords({
        where: {
          $or: [
            { etablissement_id_paysage: id },
            { etablissement_id_paysage_actuel: id },
          ],
        },
        limit: 1,
      });

      if (!historicalDoc) {
        const payload = {
          exists: false,
          etablissementActuel: null,
        };
        setCached(key, payload);
        return res.json(payload);
      }

      const whereForCurrent = {
        etablissement_id_paysage: historicalDoc.etablissement_id_paysage_actuel,
      };

      if (annee) {
        whereForCurrent.exercice = Number(annee);
      }

      const [currentDoc] = await fetchRecords({
        where: whereForCurrent,
        limit: 1,
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
