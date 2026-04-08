import { Router } from "express";
import {
  getCollection,
  buildMatchStage,
  getContextInfo,
  buildStatusSwitch,
} from "../helpers.js";

const router = Router();

router.get("/faculty-members/evolution", async (req, res) => {
  try {
    const { view, id } = req.query;
    const collection = getCollection();
    const match = buildMatchStage(view, id);
    const statusSwitch = buildStatusSwitch();

    const [
      globalEvolution,
      statusEvolution,
      ageEvolution,
      categoryEvolution,
      disciplineEvolution,
      quotiteEvolution,
      contextInfo,
    ] = await Promise.all([
      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { year: "$annee_universitaire", gender: "$sexe" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
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
              _id: { year: "$annee_universitaire", status: statusSwitch },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              status_breakdown: {
                $push: { status: "$_id.status", count: "$count" },
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
              _id: { year: "$annee_universitaire", age_class: "$classe_age3" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              age_breakdown: {
                $push: { age_class: "$_id.age_class", count: "$count" },
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
              _id: {
                year: "$annee_universitaire",
                category: "$categorie_personnels",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              category_breakdown: {
                $push: { category: "$_id.category", count: "$count" },
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
              _id: {
                year: "$annee_universitaire",
                code: "$code_grande_discipline",
                name: "$grande_discipline",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: { code: "$_id.code", name: "$_id.name" },
              total: { $sum: "$count" },
              yearly: { $push: { year: "$_id.year", count: "$count" } },
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
              _id: { year: "$annee_universitaire", quotite: "$quotite" },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$count" },
              quotite_breakdown: {
                $push: { quotite: "$_id.quotite", count: "$count" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      getContextInfo(collection, view, id),
    ]);

    res.json({
      context_info: contextInfo,
      global_evolution: globalEvolution,
      status_evolution: statusEvolution,
      age_evolution: ageEvolution,
      category_evolution: categoryEvolution,
      discipline_evolution: disciplineEvolution,
      quotite_evolution: quotiteEvolution,
    });
  } catch (error) {
    console.error("Error fetching evolution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
