import express from "express";
import { db } from "../../../../services/mongo.js";

const router = new express.Router();

// // Index pour la requête get-collaborations
// await db.collection("fr-esr-all-signed-projects-collaborations").createIndex(
//   { 
//     country_code: 1,
//     country_code_collab: 1,
//     country_name_fr_collab: 1,
//     country_name_en_collab: 1,
//     project_id: 1,
//   },
//   { name: "idx_collaborations_covered" }
// )

router
  .route("/european-projects/collaborations/get-entities")
  .get(async (req, res) => {
    const { entityName, country_code } = req.query;

    if (entityName && entityName.length < 3) {
      return res.status(400).json({
        error: "Le terme de recherche doit contenir au moins 3 caractères"
      });
    }

    try {
      const entities = await db
        .collection("fr-esr-horizon-projects-entities")
        .aggregate([
          {
            $match: {
              ...(entityName && { entities_name: { $regex: entityName, $options: "i" } }),
              ...(country_code && { country_code })
            }
          },
          {
            $group: {
              _id: "$entities_id",
              entities_name: { $first: "$entities_name" },
              entities_id: { $first: "$entities_id" }
            }
          },
          {
            $project: {
              _id: 0,
              entities_name: 1,
              entities_id: 1
            }
          }
        ])
        .toArray();

      res.status(200).json(entities);
    } catch (error) {
      console.error("Error fetching entities:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.route("/european-projects/collaborations/get-collaborations").get(async (req, res) => {
  const { country_code} = req.query;
  // TODO: ajouter pilier_code, programme_code thema_code, destination_code depuis les filtres. Attention, pilier et programme n'existent pas dans la base. Penser à refaire l'index

  if (!country_code) {
    return res.status(400).json({ error: "Le code pays est requis" });
  }

  try {
    const collaborations = await db
      .collection("fr-esr-all-signed-projects-collaborations")
      .aggregate([
        {
          $match: {
            country_code: country_code
          }
        },
        {
          $group: {
            _id: "$country_code_collab",
            country_name_fr: { $first: "$country_name_fr_collab" },
            country_name_en: { $first: "$country_name_en_collab" },
            total_collaborations: { $sum: 1 },
            // projects: {
            //   $addToSet: {
            //     project_id: "$project_id",
            //   }
            // }
          }
        },
        {
          $project: {
            _id: 0,
            country_code: "$_id",
            country_name_fr: 1,
            country_name_en: 1,
            total_collaborations: 1,
            // projects: 1
          }
        },
        {
          $sort: {
            total_collaborations: -1
          }
        }
      ])
      .toArray();

    res.status(200).json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export default router;