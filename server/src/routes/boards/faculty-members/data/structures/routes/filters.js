import { Router } from "express";
import { getCollection, buildMatchStage } from "../helpers.js";

const router = Router();

router.get("/faculty-members/filters", async (req, res) => {
  try {
    const { type, year } = req.query;
    const collection = getCollection();

    const configMap = {
      structures: {
        groupId: {
          id: "$etablissement_id_paysage",
          label: "$etablissement_lib",
        },
      },
      disciplines: {
        groupId: { id: "$code_grande_discipline", label: "$grande_discipline" },
      },
      regions: {
        groupId: {
          id: "$etablissement_region",
          label: "$etablissement_region",
        },
      },
      academies: {
        groupId: {
          id: "$etablissement_academie",
          label: "$etablissement_academie",
        },
      },
    };

    const config = configMap[type];
    if (!config) {
      return res
        .status(400)
        .json({
          error:
            "Invalid type. Must be one of: " +
            Object.keys(configMap).join(", "),
        });
    }

    const pipeline = [];
    if (year) pipeline.push({ $match: { annee_universitaire: year } });
    pipeline.push(
      { $group: { _id: config.groupId, count: { $sum: "$effectif" } } },
      { $project: { _id: 0, id: "$_id.id", label: "$_id.label", count: 1 } },
      { $match: { id: { $ne: null }, label: { $ne: null } } },
      { $sort: { label: 1 } }
    );

    const items = await collection.aggregate(pipeline).toArray();
    res.json({ items });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/years", async (req, res) => {
  try {
    const { view, id } = req.query;
    const collection = getCollection();
    const match = buildMatchStage(view, id);

    const [allYears, completeYearAgg] = await Promise.all([
      collection
        .distinct("annee_universitaire", match)
        .then((y) => y.filter((v) => v != null).sort()),
      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: "$annee_universitaire",
              hasPermanent: {
                $max: { $cond: [{ $eq: ["$is_titulaire", true] }, 1, 0] },
              },
              hasNonPermanent: {
                $max: { $cond: [{ $ne: ["$is_titulaire", true] }, 1, 0] },
              },
            },
          },
          { $match: { hasPermanent: 1, hasNonPermanent: 1 } },
          { $sort: { _id: -1 } },
          { $limit: 1 },
        ])
        .toArray(),
    ]);

    const latestCompleteYear =
      completeYearAgg[0]?._id ?? allYears[allYears.length - 1] ?? null;
    res.json({ years: allYears, latestCompleteYear });
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
