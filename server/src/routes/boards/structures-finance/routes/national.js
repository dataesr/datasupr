import express from "express";
import { fetchRecords } from "./ods-client.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/national/overview", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee } = req.query;
    const whereCondition = annee ? { exercice: Number(annee) } : {};

    const results = await fetchRecords({
      select: [
        "SUM(droits_d_inscription) as droits_d_inscription",
        "SUM(formation_continue_diplomes_propres_et_vae) as formation_continue_diplomes_propres_et_vae",
        "SUM(taxe_d_apprentissage) as taxe_d_apprentissage",
        "SUM(anr_hors_investissements_d_avenir) as anr_hors_investissements_d_avenir",
        "SUM(anr_investissements_d_avenir) as anr_investissements_d_avenir",
        "SUM(contrats_et_prestations_de_recherche_hors_anr) as contrats_et_prestations_de_recherche_hors_anr",
        "SUM(subventions_de_la_region) as subventions_de_la_region",
        "SUM(subventions_union_europeenne) as subventions_union_europeenne",
        "SUM(autres_ressources_propres) as autres_ressources_propres",
        "SUM(autres_subventions) as autres_subventions",
        "SUM(recettes_propres) as recettes_propres",
        "SUM(scsp) as scsp",
        "SUM(effectif_sans_cpge) as effectif_sans_cpge",
      ],
      where: whereCondition,
      limit: 1,
    });

    const doc = results[0] || null;
    const scspParEtudiants =
      doc && doc.effectif_sans_cpge ? doc.scsp / doc.effectif_sans_cpge : 0;

    const payload = {
      annee: annee || "all",
      data: doc
        ? { ...doc, _id: null, scsp_par_etudiants: scspParEtudiants }
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
