import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-establishment-types", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-establishment-types");
    const { annee } = req.query;

    const pipeline = [];

    if (annee) {
      pipeline.push({ $match: { academic_year: annee } });
    }

    pipeline.push({
      $project: {
        _id: 0,
        year: "$academic_year",
        totalCount: "$total_count",
        establishmentTypes: {
          $map: {
            input: "$establishment_types",
            as: "establishment",
            in: {
              type: "$$establishment.type",
              totalCount: "$$establishment.total_count",
              femmes: "$$establishment.femmes",
              hommes: "$$establishment.hommes",
              femmesPercent: "$$establishment.femmes_percent",
              hommesPercent: "$$establishment.hommes_percent",
              titulaires: "$$establishment.titulaires",
              enseignantsChercheurs: "$$establishment.enseignants_chercheurs",
              ecTitulaires: "$$establishment.ec_titulaires",
              titulairesPercent: "$$establishment.titulaires_percent",
              enseignantsChercheursPercent:
                "$$establishment.enseignants_chercheurs_percent",
              ecTitulairesPercent: "$$establishment.ec_titulaires_percent",
              disciplines: {
                $map: {
                  input: "$$establishment.disciplines",
                  as: "discipline",
                  in: {
                    disciplineId: "$$discipline.discipline_id",
                    disciplineLabel: "$$discipline.discipline_label",
                    totalCount: "$$discipline.total_count",
                    femmes: "$$discipline.femmes",
                    hommes: "$$discipline.hommes",
                    femmesPercent: "$$discipline.femmes_percent",
                    hommesPercent: "$$discipline.hommes_percent",
                    titulaires: "$$discipline.titulaires",
                    enseignantsChercheurs:
                      "$$discipline.enseignants_chercheurs",
                    ecTitulaires: "$$discipline.ec_titulaires",
                    titulairesPercent: "$$discipline.titulaires_percent",
                    enseignantsChercheursPercent:
                      "$$discipline.enseignants_chercheurs_percent",
                    ecTitulairesPercent: "$$discipline.ec_titulaires_percent",
                  },
                },
              },
            },
          },
        },
      },
    });

    pipeline.push({
      $sort: { year: -1 },
    });

    if (annee) {
      pipeline.push({ $limit: 1 });
    }

    const result = await collection.aggregate(pipeline).toArray();

    if (annee && result.length > 0) {
      res.json(result[0]);
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error("Erreur dans /faculty-members-establishment-types:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

export default router;
