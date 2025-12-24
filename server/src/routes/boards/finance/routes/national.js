import express from "express";
import { db } from "../../../../services/mongo.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/finance-universite/national/overview", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee } = req.query;
    const collection = db.collection("finance-university-main_staging");
    const matchStage = annee ? { $match: { exercice: Number(annee) } } : null;

    const pipeline = [
      ...(matchStage ? [matchStage] : []),
      {
        $group: {
          _id: null,
          droits_d_inscription: {
            $sum: { $ifNull: ["$droits_d_inscription", 0] },
          },
          formation_continue_diplomes_propres_et_vae: {
            $sum: {
              $ifNull: ["$formation_continue_diplomes_propres_et_vae", 0],
            },
          },
          taxe_d_apprentissage: {
            $sum: { $ifNull: ["$taxe_d_apprentissage", 0] },
          },
          anr_hors_investissements_d_avenir: {
            $sum: { $ifNull: ["$anr_hors_investissements_d_avenir", 0] },
          },
          anr_investissements_d_avenir: {
            $sum: { $ifNull: ["$anr_investissements_d_avenir", 0] },
          },
          contrats_et_prestations_de_recherche_hors_anr: {
            $sum: {
              $ifNull: ["$contrats_et_prestations_de_recherche_hors_anr", 0],
            },
          },
          subventions_de_la_region: {
            $sum: { $ifNull: ["$subventions_de_la_region", 0] },
          },
          subventions_union_europeenne: {
            $sum: { $ifNull: ["$subventions_union_europeenne", 0] },
          },
          autres_ressources_propres: {
            $sum: { $ifNull: ["$autres_ressources_propres", 0] },
          },
          autres_subventions: { $sum: { $ifNull: ["$autres_subventions", 0] } },
          recettes_propres: { $sum: { $ifNull: ["$recettes_propres", 0] } },
          scsp: { $sum: { $ifNull: ["$scsp", 0] } },
          effectif_sans_cpge: { $sum: { $ifNull: ["$effectif_sans_cpge", 0] } },
        },
      },
    ];

    const [doc] = await collection.aggregate(pipeline).toArray();
    const scspParEtudiants =
      doc && doc.effectif_sans_cpge ? doc.scsp / doc.effectif_sans_cpge : 0;

    const payload = {
      annee: annee || "all",
      data: doc
        ? { ...doc, scsp_par_etudiants: scspParEtudiants }
        : {
            droits_d_inscription: 0,
            formation_continue_diplomes_propres_et_vae: 0,
            taxe_d_apprentissage: 0,
            anr_hors_investissements_d_avenir: 0,
            anr_investissements_d_avenir: 0,
            contrats_et_prestations_de_recherche_hors_anr: 0,
            subventions_de_la_region: 0,
            subventions_union_europeenne: 0,
            autres_ressources_propres: 0,
            autres_subventions: 0,
            recettes_propres: 0,
            scsp: 0,
            effectif_sans_cpge: 0,
            scsp_par_etudiants: 0,
          },
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
