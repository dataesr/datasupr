import express from "express";
import { db } from "../../../../services/mongo.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/faq", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const collection = db.collection("finance-university-main-faq");

    const items = await collection
      .aggregate([{ $sort: { OrdreThématique: 1, OrdreQuestion: 1 } }])
      .toArray();

    const groupedByTheme = items.reduce((acc, item) => {
      const theme = item.ThématiqueFr;
      if (!acc[theme]) {
        acc[theme] = {
          theme,
          ordre: item.OrdreThématique,
          questions: [],
        };
      }
      acc[theme].questions.push({
        question: item.QuestionFr,
        reponse: item.RéponseFr,
        ordre: item.OrdreQuestion,
      });
      return acc;
    }, {});

    const payload = Object.values(groupedByTheme).sort(
      (a, b) => a.ordre - b.ordre
    );

    setCached(key, payload);
    return res.json(payload);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return res.status(500).json({
      error: "Failed to fetch FAQ",
      message: error.message,
    });
  }
});

export default router;
