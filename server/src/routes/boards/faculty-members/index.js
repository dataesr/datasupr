import express from "express";
import { db } from "../../../services/mongo.js";
const router = express.Router();

router.get("/universities", async (req, res) => {
  try {
    const { annee } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    let query = {};
    if (annee) {
      query = { annee_universitaire: annee };
    }

    const data = await collection
      .aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              categorie_personnels: "$categorie_personnels",
              sexe: "$sexe",
              grande_discipline: "$grande_discipline",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            totalFaculty: { $sum: "$count" },
            numMaitresDeConferencesConference: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$_id.categorie_personnels",
                      "Maître de conférences et assimilés",
                    ],
                  },
                  "$count",
                  0,
                ],
              },
            },
            numProfessor: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$_id.categorie_personnels",
                      "Professeur et assimilés",
                    ],
                  },
                  "$count",
                  0,
                ],
              },
            },
            maleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.sexe", "Masculin"] }, "$count", 0],
              },
            },
            femaleCount: {
              $sum: { $cond: [{ $eq: ["$_id.sexe", "Féminin"] }, "$count", 0] },
            },
            grande_discipline: {
              $push: {
                discipline: "$_id.grande_discipline",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            annee_universitaire: "$_id",
            totalFaculty: 1,
            numMaitresDeConferencesConference: 1,
            numProfessor: 1,
            maleCount: 1,
            femaleCount: 1,
            grande_discipline: {
              $arrayToObject: {
                $zip: {
                  inputs: [
                    "$grande_discipline.discipline",
                    "$grande_discipline.count",
                  ],
                  useLongestLength: true,
                  defaults: [null, 0],
                },
              },
            },
          },
        },
        { $sort: { annee_universitaire: 1 } },
      ])
      .toArray();

    res.json(data);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
