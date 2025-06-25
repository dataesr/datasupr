import express from "express";
import { db } from "../../../../services/mongo.js";


const router = new express.Router();


router.route("/graduates/tests/:id/:diplome").get(async (req, res) => {
  const { id, diplome } = req.params;
console.log(`Fetching graduation data for etablissement_id_paysage: ${id} and DIPLOME_r: ${diplome}`);

  try {
    // Récupération des données depuis la collection VerifDip2021
    const data = await db.collection("graduates")
      .find({
        "etablissement_id_paysage": id,
        "DIPLOME_r": diplome
      })
      .sort({ "rentree": 1 }) // Tri par année croissante
      .toArray();

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching graduation data:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


export default router;
