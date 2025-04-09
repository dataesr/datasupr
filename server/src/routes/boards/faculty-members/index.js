import express from "express";
import { db } from "../../../services/mongo.js";
const router = express.Router();

router.get("/faculty-members-geo-data", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-general-indicators");

    const data = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        {
          $unwind: "$subject", // Déconstruire le tableau "subject"
        },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              subject_id: "$subject.id",
              subject_label_fr: "$subject.label_fr",
            },
            totalHeadcount: { $sum: "$subject.headcount" },
            totalHeadcountWoman: { $first: "$headcountWoman" }, // Récupérer la valeur de headcountWoman
            totalHeadcountMan: { $first: "$headcountMan" }, // Récupérer la valeur de headcountMan
            totalHeadcountUnknown: { $first: "$headcountUnknown" }, // Récupérer la valeur de headcountUnknown
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            subjects: {
              $push: {
                id: "$_id.subject_id",
                label_fr: "$_id.subject_label_fr",
                headcount: "$totalHeadcount",
              },
            },
            totalHeadcountWoman: { $sum: "$totalHeadcountWoman" }, // Somme des headcountWoman
            totalHeadcountMan: { $sum: "$totalHeadcountMan" }, // Somme des headcountMan
            totalHeadcountUnknown: { $sum: "$totalHeadcountUnknown" }, // Somme des headcountUnknown
          },
        },
        {
          $project: {
            _id: 0,
            annee_universitaire: "$_id",
            subjects: 1,
            totalHeadcountWoman: 1,
            totalHeadcountMan: 1,
            totalHeadcountUnknown: 1,
          },
        },
        { $sort: { annee_universitaire: 1 } },
      ])
      .toArray();

    const years = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $group: { _id: "$annee_universitaire" } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, annee_universitaire: "$_id" } },
      ])
      .toArray();

    const yearsArray = years.map((year) => year.annee_universitaire);

    res.json({
      data: data,
      years: yearsArray,
    });
  } catch (error) {
    console.error("Erreur API (geo-data):", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
