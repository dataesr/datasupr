import express from "express";
import { db } from "../../../../services/mongo.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/definitions", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const collection = db.collection("finance-university-main-indicators");

    const items = await collection
      .aggregate([
        {
          $sort: { rubrique: 1, SousRubrique: 1, Indicateur: 1 },
        },
      ])
      .toArray();

    const grouped = items.reduce((acc, item) => {
      const rubrique = item.rubrique;
      const sousRubrique = item.SousRubrique;

      if (!acc[rubrique]) {
        acc[rubrique] = {
          rubrique,
          sousRubriques: {},
        };
      }

      if (!acc[rubrique].sousRubriques[sousRubrique]) {
        acc[rubrique].sousRubriques[sousRubrique] = {
          nom: sousRubrique,
          definitions: [],
        };
      }

      acc[rubrique].sousRubriques[sousRubrique].definitions.push({
        indicateur: item.Indicateur,
        libelle: item.libelleFr,
        definition: item.DefinitionFr,
        source: item.SourceFr,
        unite: item.uniteFr || "-",
      });

      return acc;
    }, {});

    const payload = Object.values(grouped).map((rubrique) => ({
      rubrique: rubrique.rubrique,
      sousRubriques: Object.values(rubrique.sousRubriques),
    }));

    setCached(key, payload);
    return res.json(payload);
  } catch (error) {
    console.error("Error fetching definitions:", error);
    return res.status(500).json({
      error: "Failed to fetch definitions",
      message: error.message,
    });
  }
});

export default router;
