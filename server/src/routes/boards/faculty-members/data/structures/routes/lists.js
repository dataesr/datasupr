import { Router } from "express";
import { getCollection } from "../helpers.js";

const router = Router();

router.get("/faculty-members/cnu-list", async (req, res) => {
  try {
    const { year } = req.query;
    const collection = getCollection();
    const match = year ? { annee_universitaire: year } : {};

    const [groupes, sections] = await Promise.all([
      collection
        .aggregate([
          { $match: { ...match, code_groupe_cnu: { $nin: [99, null] } } },
          {
            $group: { _id: { code: "$code_groupe_cnu", label: "$groupe_cnu" } },
          },
          { $sort: { "_id.code": 1 } },
          { $project: { _id: 0, code: "$_id.code", label: "$_id.label" } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { ...match, code_section_cnu: { $nin: [99, null] } } },
          {
            $group: {
              _id: {
                code: "$code_section_cnu",
                label: "$section_cnu",
                groupe: "$code_groupe_cnu",
              },
            },
          },
          { $sort: { "_id.code": 1 } },
          {
            $project: {
              _id: 0,
              code: "$_id.code",
              label: "$_id.label",
              groupe: "$_id.groupe",
            },
          },
        ])
        .toArray(),
    ]);

    res.json({ groupes, sections });
  } catch (error) {
    console.error("Error fetching CNU list:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/assimilation-list", async (req, res) => {
  try {
    const { year } = req.query;
    const collection = getCollection();
    const match = year ? { annee_universitaire: year } : {};

    const categories = await collection
      .aggregate([
        { $match: { ...match, code_categorie_assimil: { $ne: null } } },
        {
          $group: {
            _id: {
              code: "$code_categorie_assimil",
              label: "$categorie_assimilation",
            },
          },
        },
        { $sort: { "_id.label": 1 } },
        { $project: { _id: 0, code: "$_id.code", label: "$_id.label" } },
      ])
      .toArray();

    res.json({ categories });
  } catch (error) {
    console.error("Error fetching assimilation list:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
