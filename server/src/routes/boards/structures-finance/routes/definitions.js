import express from "express";
import { fetchAllRecords } from "./ods-client.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/definitions", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const items = await fetchAllRecords({
      dataset: "definitions",
    });

    const grouped = items.reduce((acc, item) => {
      const rubrique = item.rubrique;
      const sousRubrique = item.sousrubrique || "Général";

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
        indicateur: item.indicateur,
        libelle: item.libellefr || "",
        definition: item.definitionfr || "",
        interpretation: item.interpretationfr || "",
        source: item.sourcefr || "",
        unite: item.unitefr || "-",
      });

      return acc;
    }, {});

    const payload = Object.values(grouped).map((rubrique) => ({
      rubrique: rubrique.rubrique,
      sousRubriques: Object.values(rubrique.sousRubriques),
    }));

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
