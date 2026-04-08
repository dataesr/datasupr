import { Router } from "express";
import { getCollection, buildStatusSwitch, VALID_VIEWS } from "../helpers.js";

const router = Router();

async function getComparisonStats(collection, match) {
  const statusSwitch = buildStatusSwitch();
  const [genderAgg, statusAgg, categoryAgg] = await Promise.all([
    collection
      .aggregate([
        { $match: match },
        { $group: { _id: "$sexe", count: { $sum: "$effectif" } } },
      ])
      .toArray(),
    collection
      .aggregate([
        { $match: match },
        { $group: { _id: statusSwitch, count: { $sum: "$effectif" } } },
      ])
      .toArray(),
    collection
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: "$categorie_assimilation",
            count: { $sum: "$effectif" },
          },
        },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
  ]);

  const total = genderAgg.reduce((s, g) => s + g.count, 0);
  return { total, gender: genderAgg, status: statusAgg, category: categoryAgg };
}

router.get("/faculty-members/comparison", async (req, res) => {
  try {
    const { view, id, year } = req.query;
    if (!view || !VALID_VIEWS.includes(view) || !id || !year) {
      return res
        .status(400)
        .json({ error: "Missing or invalid view/id/year params" });
    }
    const collection = getCollection();
    const statusSwitch = buildStatusSwitch();

    if (view === "structure") {
      const doc = await collection.findOne(
        { etablissement_id_paysage: id },
        {
          projection: {
            etablissement_region: 1,
            etablissement_academie: 1,
            etablissement_actuel_lib: 1,
            etablissement_lib: 1,
          },
        }
      );
      if (!doc) return res.status(404).json({ error: "Structure not found" });

      const regionName = doc.etablissement_region;
      const academieName = doc.etablissement_academie;
      const entityName = doc.etablissement_actuel_lib || doc.etablissement_lib;

      const [entityStats, regionStats, academieStats] = await Promise.all([
        getComparisonStats(collection, {
          etablissement_id_paysage: id,
          annee_universitaire: year,
        }),
        getComparisonStats(collection, {
          etablissement_region: regionName,
          annee_universitaire: year,
        }),
        getComparisonStats(collection, {
          etablissement_academie: academieName,
          annee_universitaire: year,
        }),
      ]);

      return res.json({
        type: "structure",
        entity: { name: entityName, ...entityStats },
        region: { name: regionName, ...regionStats },
        academie: { name: academieName, ...academieStats },
      });
    }

    const geoField =
      view === "region" ? "etablissement_region" : "etablissement_academie";

    const establishments = await collection
      .aggregate([
        { $match: { [geoField]: id, annee_universitaire: year } },
        {
          $group: {
            _id: {
              id: "$etablissement_id_paysage",
              label: "$etablissement_lib",
              gender: "$sexe",
              status: statusSwitch,
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: { id: "$_id.id", label: "$_id.label" },
            total: { $sum: "$count" },
            gender_breakdown: {
              $push: { gender: "$_id.gender", count: "$count" },
            },
            status_breakdown: {
              $push: { status: "$_id.status", count: "$count" },
            },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 20 },
      ])
      .toArray();

    const geoStats = await getComparisonStats(collection, {
      [geoField]: id,
      annee_universitaire: year,
    });

    return res.json({
      type: view,
      entity: { name: id, ...geoStats },
      establishments,
    });
  } catch (error) {
    console.error("Error fetching comparison:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
