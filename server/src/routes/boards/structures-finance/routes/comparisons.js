import express from "express";
import { fetchRecords, fetchAllRecords } from "./ods-client.js";
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

    const whereCondition = {
      [groupBy]: groupValue,
    };
    if (annee) {
      whereCondition.exercice = Number(annee);
    }

    const items = await fetchAllRecords({
      select: [
        "etablissement_id_paysage",
        "etablissement_id_paysage_actuel",
        "etablissement_actuel_lib",
        "recettes_propres",
        "scsp",
        "region",
        "type",
        "etablissement_actuel_typologie",
        "effectif_sans_cpge",
      ],
      where: whereCondition,
      orderBy: "scsp DESC",
    });

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

    const whereCondition = {};
    if (annee) whereCondition.exercice = Number(annee);
    if (type) whereCondition.etablissement_actuel_type = type;
    if (typologie) whereCondition.etablissement_actuel_typologie = typologie;
    if (region) whereCondition.etablissement_actuel_region = region;

    const items = await fetchAllRecords({
      select: [
        "etablissement_id_paysage",
        "etablissement_id_paysage_actuel",
        "etablissement_lib",
        "etablissement_actuel_lib",
        "etablissement_categorie",
        "etablissement_actuel_categorie",
        "region",
        "etablissement_actuel_region",
        "type",
        "etablissement_actuel_type",
        "typologie",
        "etablissement_actuel_typologie",
        "recettes_propres",
        "scsp",
        "exercice",
        "effectif_sans_cpge",
        "effectif_sans_cpge_l",
        "effectif_sans_cpge_m",
        "effectif_sans_cpge_d",
        "effectif_sans_cpge_iut",
        "effectif_sans_cpge_ing",
        "effectif_sans_cpge_dsa",
        "effectif_sans_cpge_llsh",
        "effectif_sans_cpge_theo",
        "effectif_sans_cpge_si",
        "effectif_sans_cpge_staps",
        "effectif_sans_cpge_sante",
        "effectif_sans_cpge_veto",
        "effectif_sans_cpge_interd",
        "effectif_sans_cpge_deg9",
        "part_effectif_sans_cpge_l",
        "part_effectif_sans_cpge_m",
        "part_effectif_sans_cpge_d",
        "part_effectif_sans_cpge_iut",
        "part_effectif_sans_cpge_ing",
        "part_effectif_sans_cpge_dsa",
        "part_effectif_sans_cpge_llsh",
        "part_effectif_sans_cpge_theo",
        "part_effectif_sans_cpge_si",
        "part_effectif_sans_cpge_staps",
        "part_effectif_sans_cpge_sante",
        "part_effectif_sans_cpge_veto",
        "part_effectif_sans_cpge_interd",
        "part_effectif_sans_cpge_deg9",
        "has_effectif_l",
        "has_effectif_m",
        "has_effectif_d",
        "has_effectif_iut",
        "has_effectif_ing",
        "has_effectif_dsa",
        "has_effectif_llsh",
        "has_effectif_theo",
        "has_effectif_si",
        "has_effectif_staps",
        "has_effectif_sante",
        "has_effectif_veto",
        "has_effectif_interd",
        "has_effectif_deg9",
        "emploi_etpt",
        "taux_encadrement",
        "scsp_par_etudiants",
        "charges_de_personnel",
        "produits_de_fonctionnement_encaissables",
        "ressources_propres",
        "droits_d_inscription",
        "formation_continue_diplomes_propres_et_vae",
        "taxe_d_apprentissage",
        "valorisation",
        "anr_hors_investissements_d_avenir",
        "anr_investissements_d_avenir",
        "contrats_et_prestations_de_recherche_hors_anr",
        "subventions_de_la_region",
        "subventions_union_europeenne",
        "autres_ressources_propres",
        "autres_subventions",
        "part_droits_d_inscription",
        "part_formation_continue_diplomes_propres_et_vae",
        "part_taxe_d_apprentissage",
        "part_valorisation",
        "part_anr_hors_investissements_d_avenir",
        "part_anr_investissements_d_avenir",
        "part_contrats_et_prestations_de_recherche_hors_anr",
        "part_subventions_de_la_region",
        "part_subventions_union_europeenne",
        "part_autres_ressources_propres",
        "part_autres_subventions",
        "taux_de_remuneration_des_permanents",
        "charges_de_personnel_produits_encaissables",
        "emploi_etpt_etudiants",
        "anuniv",
        "is_rce",
        "rce",
        "devimmo",
        "is_devimmo",
      ],
      where: whereCondition,
      orderBy: "etablissement_actuel_lib ASC",
    });

    const processedItems = items.map((item) => {
      const part_ressources_propres =
        item.produits_de_fonctionnement_encaissables > 0
          ? (item.ressources_propres /
              item.produits_de_fonctionnement_encaissables) *
            100
          : 0;
      const recettes_totales = (item.scsp || 0) + (item.recettes_propres || 0);

      return {
        ...item,
        part_ressources_propres,
        recettes_totales,
        taux_encadrement_l: item.taux_encadrement,
        taux_encadrement_m: item.taux_encadrement,
        taux_encadrement_d: item.taux_encadrement,
        taux_encadrement_iut: item.taux_encadrement,
        taux_encadrement_ing: item.taux_encadrement,
        taux_encadrement_dsa: item.taux_encadrement,
        taux_encadrement_llsh: item.taux_encadrement,
        taux_encadrement_theo: item.taux_encadrement,
        taux_encadrement_si: item.taux_encadrement,
        taux_encadrement_staps: item.taux_encadrement,
        taux_encadrement_sante: item.taux_encadrement,
        taux_encadrement_veto: item.taux_encadrement,
        taux_encadrement_interd: item.taux_encadrement,
        taux_encadrement_deg9: item.taux_encadrement,
      };
    });

    const payload = {
      annee: annee || "all",
      filters: { type, typologie, region },
      count: processedItems.length,
      items: processedItems,
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
    const whereCondition = annee ? { exercice: Number(annee) } : {};

    const items = await fetchRecords({
      select: [
        "etablissement_id_paysage_actuel",
        "etablissement_uai",
        "etablissement_actuel_lib",
        "recettes_propres",
        "scsp",
        "exercice",
        "region",
        "etablissement_actuel_typologie",
      ],
      where: whereCondition,
      orderBy: "scsp DESC",
      limit: Number(limit),
    });

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
    const whereCondition = annee ? { exercice: Number(annee) } : {};

    const items = await fetchAllRecords({
      select: [
        "etablissement_id_paysage",
        "etablissement_id_paysage_actuel",
        "etablissement_actuel_lib",
        "etablissement_uai",
        "type",
        "region",
        "etablissement_actuel_typologie",
        "exercice",
        "charges_de_personnel_produits_encaissables",
        "scsp_par_etudiants",
        "taux_encadrement",
        "effectif_sans_cpge",
        "recettes_propres",
        "scsp",
        "ressources_propres",
        "produits_de_fonctionnement_encaissables",
      ],
      where: whereCondition,
      orderBy: "etablissement_actuel_lib ASC",
    });

    const processedItems = items.map((item) => {
      const part_ressources_propres =
        item.produits_de_fonctionnement_encaissables > 0
          ? (item.ressources_propres /
              item.produits_de_fonctionnement_encaissables) *
            100
          : 0;

      return {
        ...item,
        part_ressources_propres,
      };
    });

    const payload = {
      annee: annee || "all",
      items: processedItems,
    };

    setCached(key, payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
