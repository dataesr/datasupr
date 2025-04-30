import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

/**
 * Route pour obtenir l'évolution des effectifs enseignants par année
 */
router.get("/faculty-members-trends", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-trends-by-year");
    const { annee, discipline, years } = req.query;

    const pipeline = [];

    if (annee) {
      pipeline.push({ $match: { academic_year: annee } });
    } else if (years) {
      const yearsArray = years.split(",");
      pipeline.push({ $match: { academic_year: { $in: yearsArray } } });
    }

    pipeline.push({
      $project: {
        _id: 0,
        year: "$academic_year",
        totalCount: "$total_count",
        femmes: 1,
        hommes: 1,
        inconnus: 1,
        femmes_percent: 1,
        hommes_percent: 1,
        enseignants_chercheurs: 1,
        titulaires: 1,
        non_titulaires: 1,
        ec_titulaires: 1,
        enseignants_chercheurs_percent: 1,
        titulaires_percent: 1,
        ec_titulaires_percent: 1,

        disciplines: {
          $map: {
            input: "$disciplines",
            as: "discipline",
            in: {
              fieldId: "$$discipline.field_id",
              fieldLabel: "$$discipline.field_label",
              totalCount: "$$discipline.total_count",
              femmes: "$$discipline.femmes",
              hommes: "$$discipline.hommes",
              inconnus: "$$discipline.inconnus",
              femmes_percent: "$$discipline.femmes_percent",
              hommes_percent: "$$discipline.hommes_percent",
              enseignantsChercheurs: "$$discipline.enseignants_chercheurs",
              titulaires: "$$discipline.titulaires",
              nonTitulaires: "$$discipline.non_titulaires",
              ecTitulaires: "$$discipline.ec_titulaires",
              enseignantsChercheursPercent:
                "$$discipline.enseignants_chercheurs_percent",
              titulairesPercent: "$$discipline.titulaires_percent",
              ecTitulairesPercent: "$$discipline.ec_titulaires_percent",

              ageDistribution: "$$discipline.age_distribution",
            },
          },
        },
      },
    });

    if (discipline) {
      pipeline.push({
        $addFields: {
          disciplines: {
            $filter: {
              input: "$disciplines",
              as: "disc",
              cond: { $eq: ["$$disc.fieldId", discipline] },
            },
          },
        },
      });
    }

    pipeline.push({
      $sort: { year: 1 },
    });

    const result = await collection.aggregate(pipeline).toArray();

    if (annee && result.length > 0) {
      res.json(result[0]);
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error("Erreur dans /faculty-members-trends:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

/**
 * Route pour obtenir les comparaisons entre années spécifiques
 * Utile pour les graphiques d'évolution ou les tableaux comparatifs
 */
router.get("/faculty-members-evolution", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-trends-by-year");
    const { disciplines } = req.query;

    const disciplinesArray = disciplines ? disciplines.split(",") : [];

    const pipeline = [
      { $sort: { academic_year: 1 } },
      {
        $project: {
          _id: 0,
          year: "$academic_year",
          totalCount: "$total_count",

          globalStats: {
            femmes_percent: "$femmes_percent",
            hommes_percent: "$hommes_percent",
            titulaires_percent: "$titulaires_percent",
            enseignants_chercheurs_percent: "$enseignants_chercheurs_percent",
            ec_titulaires_percent: "$ec_titulaires_percent",
          },

          disciplines:
            disciplinesArray.length > 0
              ? {
                  $filter: {
                    input: "$disciplines",
                    as: "disc",
                    cond: { $in: ["$$disc.field_id", disciplinesArray] }, // ✓ Utiliser field_id
                  },
                }
              : "$disciplines",
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();

    const processedResult = {
      years: result.map((item) => item.year),
      globalTrend: {
        totalCount: result.map((item) => item.totalCount),
        femmes_percent: result.map((item) => item.globalStats.femmes_percent),
        hommes_percent: result.map((item) => item.globalStats.hommes_percent),
        titulaires_percent: result.map(
          (item) => item.globalStats.titulaires_percent
        ),
        enseignants_chercheurs_percent: result.map(
          (item) => item.globalStats.enseignants_chercheurs_percent
        ),
      },
      disciplinesTrend: {},
    };

    const allDisciplines = new Set();

    result.forEach((yearData) => {
      yearData.disciplines.forEach((disc) => {
        allDisciplines.add(disc.field_id);
      });
    });

    Array.from(allDisciplines).forEach((disciplineId) => {
      processedResult.disciplinesTrend[disciplineId] = {
        fieldId: disciplineId,
        fieldLabel: "",
        totalCount: [],
        femmes_percent: [],
        titulaires_percent: [],
        enseignants_chercheurs_percent: [],
      };

      result.forEach((yearData) => {
        const discipline = yearData.disciplines.find(
          (d) => d.field_id === disciplineId
        );

        if (discipline) {
          if (!processedResult.disciplinesTrend[disciplineId].fieldLabel) {
            processedResult.disciplinesTrend[disciplineId].fieldLabel =
              discipline.field_label;
          }

          processedResult.disciplinesTrend[disciplineId].totalCount.push(
            discipline.total_count
          );
          processedResult.disciplinesTrend[disciplineId].femmes_percent.push(
            discipline.femmes_percent
          );
          processedResult.disciplinesTrend[
            disciplineId
          ].titulaires_percent.push(discipline.titulaires_percent);
          processedResult.disciplinesTrend[
            disciplineId
          ].enseignants_chercheurs_percent.push(
            discipline.enseignants_chercheurs_percent
          );
        } else {
          processedResult.disciplinesTrend[disciplineId].totalCount.push(null);
          processedResult.disciplinesTrend[disciplineId].femmes_percent.push(
            null
          );
          processedResult.disciplinesTrend[
            disciplineId
          ].titulaires_percent.push(null);
          processedResult.disciplinesTrend[
            disciplineId
          ].enseignants_chercheurs_percent.push(null);
        }
      });
    });
    res.json(processedResult);
  } catch (err) {
    console.error("Erreur dans /faculty-members-evolution:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

/**
 * Route pour obtenir les données d'évolution par âge
 * Utile pour les graphiques montrant les évolutions de pyramides des âges
 */
/**
 * Route pour obtenir les données d'évolution par âge
 * Utile pour les graphiques montrant les évolutions de pyramides des âges
 */
/**
 * Route pour obtenir les données d'évolution par âge
 * Utile pour les graphiques montrant les évolutions de pyramides des âges
 */
router.get("/faculty-members-age-evolution", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-trends-by-year");
    const { discipline } = req.query;

    // Classes d'âge présentes dans les données
    const ageClasses = ["35 ans et moins", "36 à 55 ans", "56 ans et plus"];

    // Classes d'âge pour l'affichage
    const displayAgeClasses = ["<36", "36-55", ">55"];

    // Mapper les classes d'âge de la DB vers les classes d'affichage
    const mapAgeClass = (ageClass) => {
      switch (ageClass) {
        case "35 ans et moins":
          return "<36";
        case "36 à 55 ans":
          return "36-55";
        case "56 ans et plus":
          return ">55";
        default:
          return ageClass;
      }
    };

    // Pipeline pour récupérer les données par année
    const pipeline = [
      // Trier par année académique
      { $sort: { academic_year: 1 } },

      // Projeter les champs nécessaires
      {
        $project: {
          _id: 0,
          year: "$academic_year",
          allDisciplines: "$disciplines",
          // Si discipline est spécifiée, filtrer les disciplines
          disciplines: discipline
            ? {
                $filter: {
                  input: "$disciplines",
                  as: "disc",
                  cond: { $eq: ["$$disc.field_id", discipline] },
                },
              }
            : "$disciplines",
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();

    // Transformer le résultat pour le format attendu par le front
    const processedResult = {
      years: result.map((item) => item.year),
      ageEvolution: {},
    };

    // Traiter les données pour la discipline spécifiée ou toutes les disciplines
    if (discipline) {
      // Initialiser la structure pour la discipline spécifique
      processedResult.ageEvolution[discipline] = {
        fieldId: discipline,
        fieldLabel: "",
        ageData: {},
      };

      // Initialiser les données pour chaque classe d'âge
      displayAgeClasses.forEach((ageClass) => {
        processedResult.ageEvolution[discipline].ageData[ageClass] = {
          counts: Array(result.length).fill(0),
          percents: Array(result.length).fill(0),
        };
      });

      // Remplir les données
      result.forEach((yearData, yearIndex) => {
        // Vérifier si la discipline existe pour cette année
        if (yearData.disciplines && yearData.disciplines.length > 0) {
          const disciplineData = yearData.disciplines[0];

          // Mémoriser le libellé de la discipline (une seule fois suffit)
          if (
            !processedResult.ageEvolution[discipline].fieldLabel &&
            disciplineData.field_label
          ) {
            processedResult.ageEvolution[discipline].fieldLabel =
              disciplineData.field_label;
          }

          // Parcourir les données d'âge
          if (disciplineData.age_distribution) {
            disciplineData.age_distribution.forEach((ageGroup) => {
              if (ageGroup && ageGroup.age_class) {
                const displayClass = mapAgeClass(ageGroup.age_class);

                // Vérifier que displayClass existe dans la structure
                if (
                  processedResult.ageEvolution[discipline].ageData[displayClass]
                ) {
                  processedResult.ageEvolution[discipline].ageData[
                    displayClass
                  ].counts[yearIndex] = ageGroup.total || 0;
                  processedResult.ageEvolution[discipline].ageData[
                    displayClass
                  ].percents[yearIndex] = ageGroup.percent || 0;
                }
              }
            });
          }
        }
      });
    } else {
      // Pour toutes les disciplines (données globales)
      processedResult.ageEvolution.global = {
        fieldId: "global",
        fieldLabel: "Toutes disciplines",
        ageData: {},
      };

      // Initialiser les données pour chaque classe d'âge
      displayAgeClasses.forEach((ageClass) => {
        processedResult.ageEvolution.global.ageData[ageClass] = {
          counts: Array(result.length).fill(0),
          percents: Array(result.length).fill(0),
        };
      });

      // Remplir les données globales
      result.forEach((yearData, yearIndex) => {
        // Calcul pour toutes les disciplines combinées
        const ageTotals = {};
        let yearTotal = 0;

        // Initialiser les totaux par classe d'âge
        ageClasses.forEach((ageClass) => {
          ageTotals[ageClass] = 0;
        });

        // Parcourir toutes les disciplines pour cette année
        yearData.allDisciplines.forEach((discipline) => {
          if (discipline.age_distribution) {
            discipline.age_distribution.forEach((ageGroup) => {
              // Ajouter au total de cette classe d'âge
              ageTotals[ageGroup.age_class] += ageGroup.total;
              yearTotal += ageGroup.total;
            });
          }
        });

        // Calculer les pourcentages et enregistrer les résultats
        ageClasses.forEach((ageClass) => {
          const displayClass = mapAgeClass(ageClass);
          processedResult.ageEvolution.global.ageData[displayClass].counts[
            yearIndex
          ] = ageTotals[ageClass];
          processedResult.ageEvolution.global.ageData[displayClass].percents[
            yearIndex
          ] = yearTotal > 0 ? (ageTotals[ageClass] / yearTotal) * 100 : 0;
        });
      });
    }

    res.json(processedResult);
  } catch (err) {
    console.error("Erreur dans /faculty-members-age-evolution:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

export default router;
