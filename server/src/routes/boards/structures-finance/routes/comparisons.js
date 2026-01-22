import express from "express";
import { db } from "../../../../services/mongo.js";
import { cacheKey, getCached, setCached } from "./cache.js";

const router = express.Router();

router.get("/structures-finance/comparisons/compare", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee, groupBy, groupValue } = req.query;
    if (!groupBy || !groupValue) {
      return res
        .status(400)
        .json({ error: "groupBy and groupValue are required" });
    }

    const collection = db.collection("finance-university-main_staging");
    const matchStage = {
      [groupBy]: groupValue,
      ...(annee ? { exercice: Number(annee) } : {}),
    };

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          _id: 0,
          etablissement_id_paysage: 1,
          etablissement_id_paysage_actuel: 1,
          etablissement_actuel_lib: 1,
          recettes_propres: 1,
          scsp: 1,
          region: 1,
          type: 1,
          etablissement_actuel_typologie: 1,
          effectif_sans_cpge: 1,
        },
      },
      { $sort: { scsp: -1 } },
    ];

    const items = await collection.aggregate(pipeline).toArray();
    const payload = {
      annee: annee || "all",
      groupBy,
      groupValue,
      items,
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

router.get("/structures-finance/comparisons/advanced", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee, type, typologie, region } = req.query;
    const collection = db.collection("finance-university-main_staging");

    const matchStage = {
      ...(annee ? { exercice: Number(annee) } : {}),
      ...(type ? { etablissement_actuel_type: type } : {}),
      ...(typologie ? { etablissement_actuel_typologie: typologie } : {}),
      ...(region ? { etablissement_actuel_region: region } : {}),
    };

    const pipeline = [
      { $match: matchStage },
      {
        $addFields: {
          part_ressources_propres: {
            $cond: {
              if: { $gt: ["$produits_de_fonctionnement_encaissables", 0] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      "$ressources_propres",
                      "$produits_de_fonctionnement_encaissables",
                    ],
                  },
                  100,
                ],
              },
              else: 0,
            },
          },
          recettes_totales: {
            $add: [
              { $ifNull: ["$scsp", 0] },
              { $ifNull: ["$recettes_propres", 0] },
            ],
          },
          taux_encadrement_l: "$taux_encadrement",
          taux_encadrement_m: "$taux_encadrement",
          taux_encadrement_d: "$taux_encadrement",
          taux_encadrement_iut: "$taux_encadrement",
          taux_encadrement_ing: "$taux_encadrement",
          taux_encadrement_dsa: "$taux_encadrement",
          taux_encadrement_llsh: "$taux_encadrement",
          taux_encadrement_theo: "$taux_encadrement",
          taux_encadrement_si: "$taux_encadrement",
          taux_encadrement_staps: "$taux_encadrement",
          taux_encadrement_sante: "$taux_encadrement",
          taux_encadrement_veto: "$taux_encadrement",
          taux_encadrement_interd: "$taux_encadrement",
        },
      },
      {
        $project: {
          _id: 0,
          etablissement_id_paysage: 1,
          etablissement_id_paysage_actuel: 1,
          etablissement_lib: 1,
          etablissement_actuel_lib: 1,
          region: 1,
          etablissement_actuel_region: 1,
          type: 1,
          etablissement_actuel_type: 1,
          etablissement_actuel_typologie: 1,
          recettes_propres: 1,
          scsp: 1,
          exercice: 1,
          effectif_sans_cpge: 1,
          effectif_sans_cpge_l: 1,
          effectif_sans_cpge_m: 1,
          effectif_sans_cpge_d: 1,
          effectif_sans_cpge_iut: 1,
          effectif_sans_cpge_ing: 1,
          effectif_sans_cpge_dsa: 1,
          effectif_sans_cpge_llsh: 1,
          effectif_sans_cpge_theo: 1,
          effectif_sans_cpge_si: 1,
          effectif_sans_cpge_staps: 1,
          effectif_sans_cpge_sante: 1,
          effectif_sans_cpge_veto: 1,
          effectif_sans_cpge_interd: 1,
          part_effectif_sans_cpge_l: 1,
          part_effectif_sans_cpge_m: 1,
          part_effectif_sans_cpge_d: 1,
          part_effectif_sans_cpge_iut: 1,
          part_effectif_sans_cpge_ing: 1,
          part_effectif_sans_cpge_dsa: 1,
          part_effectif_sans_cpge_llsh: 1,
          part_effectif_sans_cpge_theo: 1,
          part_effectif_sans_cpge_si: 1,
          part_effectif_sans_cpge_staps: 1,
          part_effectif_sans_cpge_sante: 1,
          part_effectif_sans_cpge_veto: 1,
          part_effectif_sans_cpge_interd: 1,
          has_effectif_l: 1,
          has_effectif_m: 1,
          has_effectif_d: 1,
          has_effectif_iut: 1,
          has_effectif_ing: 1,
          has_effectif_dsa: 1,
          has_effectif_llsh: 1,
          has_effectif_theo: 1,
          has_effectif_si: 1,
          has_effectif_staps: 1,
          has_effectif_sante: 1,
          has_effectif_veto: 1,
          has_effectif_interd: 1,
          emploi_etpt: 1,
          taux_encadrement: 1,
          taux_encadrement_l: 1,
          taux_encadrement_m: 1,
          taux_encadrement_d: 1,
          taux_encadrement_iut: 1,
          taux_encadrement_ing: 1,
          taux_encadrement_dsa: 1,
          taux_encadrement_llsh: 1,
          taux_encadrement_theo: 1,
          taux_encadrement_si: 1,
          taux_encadrement_staps: 1,
          taux_encadrement_sante: 1,
          taux_encadrement_veto: 1,
          taux_encadrement_interd: 1,
          scsp_par_etudiants: 1,
          charges_de_personnel: 1,
          produits_de_fonctionnement_encaissables: 1,
          ressources_propres: 1,
          part_ressources_propres: 1,
          droits_d_inscription: 1,
          formation_continue_diplomes_propres_et_vae: 1,
          taxe_d_apprentissage: 1,
          valorisation: 1,
          anr_hors_investissements_d_avenir: 1,
          anr_investissements_d_avenir: 1,
          contrats_et_prestations_de_recherche_hors_anr: 1,
          subventions_de_la_region: 1,
          subventions_union_europeenne: 1,
          autres_ressources_propres: 1,
          autres_subventions: 1,
          part_droits_d_inscription: 1,
          part_formation_continue_diplomes_propres_et_vae: 1,
          part_taxe_d_apprentissage: 1,
          part_valorisation: 1,
          part_anr_hors_investissements_d_avenir: 1,
          part_anr_investissements_d_avenir: 1,
          part_contrats_et_prestations_de_recherche_hors_anr: 1,
          part_subventions_de_la_region: 1,
          part_subventions_union_europeenne: 1,
          part_autres_ressources_propres: 1,
          part_autres_subventions: 1,
          taux_de_remuneration_des_permanents: 1,
          charges_de_personnel_produits_encaissables: 1,
          emploi_etpt_etudiants: 1,
          emplois_total: 1,
          part_ressources_propres: 1,
          recettes_totales: 1,
          anuniv: 1,
        },
      },
      { $sort: { etablissement_actuel_lib: 1 } },
    ];

    const items = await collection.aggregate(pipeline).toArray();
    const payload = {
      annee: annee || "all",
      filters: { type, typologie, region },
      count: items.length,
      items,
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

router.get("/structures-finance/comparaisons", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee, limit = 100 } = req.query;
    const collection = db.collection("finance-university-main_staging");
    const matchStage = annee ? { $match: { exercice: Number(annee) } } : null;

    const pipeline = [
      ...(matchStage ? [matchStage] : []),
      {
        $project: {
          _id: 0,
          etablissement_id_paysage_actuel: 1,
          etablissement_uai: 1,
          etablissement_actuel_lib: 1,
          recettes_propres: 1,
          scsp: 1,
          exercice: 1,
          region: 1,
          etablissement_actuel_typologie: 1,
        },
      },
      { $sort: { scsp: -1 } },
      { $limit: Number(limit) },
    ];

    const items = await collection.aggregate(pipeline).toArray();
    const payload = {
      annee: annee || "all",
      items,
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

router.get("/structures-finance/comparisons/data", async (req, res) => {
  try {
    const key = cacheKey(req.path, req.query);
    const hit = getCached(key);
    if (hit) return res.json(hit);

    const { annee } = req.query;
    const collection = db.collection("finance-university-main_staging");
    const matchStage = annee ? { exercice: Number(annee) } : {};

    const pipeline = [
      { $match: matchStage },
      {
        $addFields: {
          part_ressources_propres: {
            $cond: {
              if: { $gt: ["$produits_de_fonctionnement_encaissables", 0] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      "$ressources_propres",
                      "$produits_de_fonctionnement_encaissables",
                    ],
                  },
                  100,
                ],
              },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          etablissement_id_paysage: 1,
          etablissement_id_paysage_actuel: 1,
          etablissement_actuel_lib: 1,
          etablissement_uai: 1,
          type: 1,
          region: 1,
          etablissement_actuel_typologie: 1,
          exercice: 1,
          part_ressources_propres: 1,
          charges_de_personnel_produits_encaissables: 1,
          scsp_par_etudiants: 1,
          taux_encadrement: 1,
          effectif_sans_cpge: 1,
          recettes_propres: 1,
          scsp: 1,
        },
      },
      { $sort: { etablissement_actuel_lib: 1 } },
    ];

    const items = await collection.aggregate(pipeline).toArray();
    const payload = {
      annee: annee || "all",
      items,
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
