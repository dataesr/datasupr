import express from "express";
import { fetchAllRecords } from "./ods-client.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/faq", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const items = await fetchAllRecords({
      dataset: "faq",
    });

    const groupedByTheme = items.reduce((acc, item) => {
      const theme = item.thematiquefr || "Général";
      const ordre = item.ordrethematique || 0;
      
      if (!acc[theme]) {
        acc[theme] = {
          theme,
          ordre,
          questions: [],
        };
      }
      acc[theme].questions.push({
        question: item.questionfr || "",
        reponse: item.reponsefr || "",
        ordre: item.ordrequestion || 0,
      });
      return acc;
    }, {});

    const payload = Object.values(groupedByTheme).sort(
      (a, b) => a.ordre - b.ordre
    );

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
