import { Router } from "express";
import {
  getCollection,
  buildMatchStage,
  getContextInfo,
  buildStatusSwitch,
  VALID_VIEWS,
} from "../helpers.js";

const router = Router();

router.get("/faculty-members/dashboard", async (req, res) => {
  try {
    const { view, id, year } = req.query;
    if (!view || !VALID_VIEWS.includes(view)) {
      return res.status(400).json({ error: "Invalid or missing view param" });
    }
    const collection = getCollection();
    const match = buildMatchStage(view, id, year);
    const statusSwitch = buildStatusSwitch();

    const topGroupConfig = {
      structure: {
        id: "$etablissement_id_paysage",
        label: "$etablissement_lib",
      },
      discipline: {
        id: "$code_grande_discipline",
        label: "$grande_discipline",
      },
      region: { id: "$etablissement_region", label: "$etablissement_region" },
      academie: {
        id: "$etablissement_academie",
        label: "$etablissement_academie",
      },
    };

    const [
      genderAgg,
      statusAgg,
      disciplineAgg,
      ageAgg,
      categoryAgg,
      establishmentTypeAgg,
      quotiteByGenderAgg,
      quotiteByAgeAgg,
      topItems,
      contextInfo,
    ] = await Promise.all([
      collection
        .aggregate([
          { $match: match },
          { $group: { _id: "$sexe", count: { $sum: "$effectif" } } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { status: statusSwitch, gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.status",
              count: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                code: "$code_grande_discipline",
                name: "$grande_discipline",
                gender: "$sexe",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: { code: "$_id.code", name: "$_id.name" },
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $sort: { total: -1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { age_class: "$classe_age3", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.age_class",
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { category: "$categorie_assimilation", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.category",
              total: { $sum: "$count" },
              gender_breakdown: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
            },
          },
          { $match: { _id: { $ne: null } } },
          { $sort: { total: -1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: "$etablissement_type",
              total_count: { $sum: "$effectif" },
            },
          },
          { $match: { _id: { $ne: null } } },
          { $sort: { total_count: -1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { quotite: "$quotite", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.gender",
              total: { $sum: "$count" },
              quotite_breakdown: {
                $push: { quotite: "$_id.quotite", count: "$count" },
              },
            },
          },
          { $match: { _id: { $ne: null } } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                age: "$classe_age3",
                gender: "$sexe",
                quotite: "$quotite",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: { age: "$_id.age", gender: "$_id.gender" },
              total: { $sum: "$count" },
              quotite_breakdown: {
                $push: { quotite: "$_id.quotite", count: "$count" },
              },
            },
          },
          {
            $group: {
              _id: "$_id.age",
              total: { $sum: "$total" },
              by_gender: {
                $push: {
                  gender: "$_id.gender",
                  total: "$total",
                  quotite_breakdown: "$quotite_breakdown",
                },
              },
            },
          },
          { $match: { _id: { $ne: null } } },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: year ? { annee_universitaire: year } : {} },
          {
            $group: {
              _id: {
                id: topGroupConfig[view].id,
                label: topGroupConfig[view].label,
                gender: "$sexe",
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
            },
          },
          { $sort: { total: -1 } },
          { $limit: 5 },
        ])
        .toArray(),

      getContextInfo(collection, view, id),
    ]);

    const total_count = genderAgg.reduce((s, g) => s + g.count, 0);

    res.json({
      context_info: contextInfo,
      total_count,
      gender_distribution: genderAgg,
      status_distribution: statusAgg,
      discipline_distribution: disciplineAgg,
      age_distribution: ageAgg,
      category_distribution: categoryAgg,
      establishment_type_distribution: establishmentTypeAgg,
      quotite_by_gender: quotiteByGenderAgg,
      quotite_by_age: quotiteByAgeAgg,
      top_items: topItems,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
