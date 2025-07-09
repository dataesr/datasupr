import express from "express";
import { db } from "../../../../services/mongo.js";


const router = new express.Router();


router.route("/graduates/tests/options").get(async (req, res) => {
  try {
    // Récupération des IDs distincts
    const etablissementIds = await db.collection("graduates")
      .distinct("etablissement_id_paysage");

    // Récupération des diplômes distincts
    const diplomes = await db.collection("graduates")
      .distinct("DIPLOME_r");

    // Récupération des composantes distinctes
    const composantes = await db.collection("graduates")
      .distinct("Décomposition des universités");

    // Tri par ordre alphabétique et filtrage des valeurs nulles/undefined
    const sortedData = {
      etablissement_ids: etablissementIds
        .filter(id => id != null)
        .sort(),
      diplomes: diplomes
        .filter(diplome => diplome != null)
        .sort(),
      composantes: composantes
        .filter(composante => composante != null)
        .sort()
    };

    res.status(200).json(sortedData);
  } catch (error) {
    console.error("Error fetching options data:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


router.route("/graduates/tests/:id/:diplome").get(async (req, res) => {
  const { id, diplome } = req.params;
  const { composante } = req.query;
  
  console.log(`Fetching graduation data for etablissement_id_paysage: ${id} and DIPLOME_r: ${diplome}${composante ? ` and Décomposition des universités: ${composante}` : ''}`);

  try {
    // Construction du filtre de base
    const filter = {
      "etablissement_id_paysage": id,
      "DIPLOME_r": diplome
    };

    // Ajout du filtre composante si spécifié
    if (composante) {
      filter["Décomposition des universités"] = composante;
    }

    // Récupération des données depuis la collection graduates
    const data = await db.collection("graduates")
      .find(filter)
      .sort({ "rentree": 1 }) // Tri par année croissante
      .toArray();

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching graduation data:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});



export default router;
