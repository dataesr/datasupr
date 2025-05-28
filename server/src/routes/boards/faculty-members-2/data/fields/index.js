import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/fields", async (req, res) => {
  try {
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const fields = await collection
      .aggregate([
        {
          $group: {
            _id: {
              id: "$code_grande_discipline",
              lib: "$grande_discipline",
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            lib: "$_id.lib",
          },
        },
        {
          $match: {
            id: { $ne: null },
            lib: { $ne: null },
          },
        },
        {
          $sort: { lib: 1 },
        },
      ])
      .toArray();

    res.json({
      fields: fields,
    });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({
      error: "Server error while fetching fields",
    });
  }
});

router.get("/faculty-members/fields/overview", async (req, res) => {
  try {
    const { year, field_id } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const matchStage = {};
    if (year) matchStage.annee_universitaire = year;
    if (field_id) matchStage.code_grande_discipline = field_id;

    // Le genre par discipline
    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$sexe",
            count: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    // La répartition des personnels par catégorie
    const personnalCategoryDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$categorie_personnels",
            count: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    // L'âge par discipline
    const ageDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$classe_age3",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // Le nombre d'enseignants par discipline par discipline
    const disciplineDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              discipline_code: "$code_grande_discipline",
              discipline_name: "$grande_discipline",
            },
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Le nombre d'enseignants titulaire par discipline
    const permanentDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$is_titulaire",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Le nombre d'enseignants chercheur par discipline
    const researcherDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$is_enseignant_chercheur",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Total
    const totalCount = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    res.json({
      gender_distribution: genderDistribution,
      age_distribution: ageDistribution,
      discipline_distribution: disciplineDistribution,
      permanentDistribution: permanentDistribution,
      researcherDistribution: researcherDistribution,
      total_count: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching fields overview:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
