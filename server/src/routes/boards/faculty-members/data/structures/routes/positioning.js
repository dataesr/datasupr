import { Router } from "express";
import { getCollection, VALID_VIEWS } from "../helpers.js";

const router = Router();

const GROUP_ID_BY_VIEW = {
  structure: {
    entity_id: "$etablissement_id_paysage_actuel",
    entity_label: "$etablissement_actuel_lib",
    entity_type: "$etablissement_type",
    entity_region: "$etablissement_region",
    entity_code_region: "$etablissement_code_region",
    entity_academie: "$etablissement_academie",
    entity_code_academie: "$etablissement_code_academie",
  },
  region: {
    entity_id: "$etablissement_region",
    entity_label: "$etablissement_region",
    entity_code_region: "$etablissement_code_region",
  },
  academie: {
    entity_id: "$etablissement_academie",
    entity_label: "$etablissement_academie",
    entity_academie: "$etablissement_academie",
    entity_code_academie: "$etablissement_code_academie",
    entity_region: "$etablissement_region",
    entity_code_region: "$etablissement_code_region",
  },
  discipline: {
    entity_id: "$code_grande_discipline",
    entity_label: "$grande_discipline",
  },
};

router.get("/faculty-members/positioning", async (req, res) => {
  try {
    const {
      view = "structure",
      year,
      cnu_type,
      cnu_code,
      assimil_code,
    } = req.query;
    if (!VALID_VIEWS.includes(view)) {
      return res.status(400).json({ error: "Invalid view parameter" });
    }
    const collection = getCollection();
    const match = {};
    if (year) match.annee_universitaire = year;
    if (cnu_type === "groupe" && cnu_code)
      match.code_groupe_cnu = parseInt(cnu_code);
    if (cnu_type === "section" && cnu_code)
      match.code_section_cnu = parseInt(cnu_code);
    if (assimil_code) match.code_categorie_assimil = assimil_code;

    const items = await collection
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: GROUP_ID_BY_VIEW[view],
            total: { $sum: "$effectif" },
            female: {
              $sum: { $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0] },
            },
            ec: {
              $sum: {
                $cond: [
                  { $eq: ["$is_enseignant_chercheur", true] },
                  "$effectif",
                  0,
                ],
              },
            },
            titulaires: {
              $sum: {
                $cond: [{ $eq: ["$is_titulaire", true] }, "$effectif", 0],
              },
            },
            pr: {
              $sum: {
                $cond: [
                  {
                    $regexMatch: {
                      input: { $ifNull: ["$categorie_assimilation", ""] },
                      regex: "professeur",
                      options: "i",
                    },
                  },
                  "$effectif",
                  0,
                ],
              },
            },
            mcf: {
              $sum: {
                $cond: [
                  {
                    $regexMatch: {
                      input: { $ifNull: ["$categorie_assimilation", ""] },
                      regex: "conf[eé]rences",
                      options: "i",
                    },
                  },
                  "$effectif",
                  0,
                ],
              },
            },
            non_permanents: {
              $sum: {
                $cond: [{ $eq: ["$is_titulaire", false] }, "$effectif", 0],
              },
            },
            age_35_moins: {
              $sum: {
                $cond: [
                  { $eq: ["$classe_age3", "35 ans et moins"] },
                  "$effectif",
                  0,
                ],
              },
            },
            age_36_55: {
              $sum: {
                $cond: [
                  { $eq: ["$classe_age3", "36 à 55 ans"] },
                  "$effectif",
                  0,
                ],
              },
            },
            age_56_plus: {
              $sum: {
                $cond: [
                  { $eq: ["$classe_age3", "56 ans et plus"] },
                  "$effectif",
                  0,
                ],
              },
            },
            temps_plein: {
              $sum: {
                $cond: [{ $eq: ["$quotite", "Temps plein"] }, "$effectif", 0],
              },
            },
            pers_2nd_degre: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$categorie_assimilation",
                      "Enseignants du 2nd degré et Arts et métiers",
                    ],
                  },
                  "$effectif",
                  0,
                ],
              },
            },
          },
        },
        { $match: { total: { $gt: 0 } } },
        { $sort: { total: -1 } },
      ])
      .toArray();

    const pct = (num, den) => (den > 0 ? (num / den) * 100 : 0);

    const result = items
      .filter((item) => item._id.entity_id && item._id.entity_label)
      .map((item) => ({
        etablissement_id_paysage_actuel: item._id.entity_id,
        etablissement_actuel_lib: item._id.entity_label,
        etablissement_type: item._id.entity_type || null,
        etablissement_region: item._id.entity_region || null,
        etablissement_code_region: item._id.entity_code_region || null,
        etablissement_academie: item._id.entity_academie || null,
        etablissement_code_academie: item._id.entity_code_academie || null,
        total_effectif: item.total,
        taux_feminisation: pct(item.female, item.total),
        taux_ec: pct(item.ec, item.total),
        taux_titulaires: pct(item.titulaires, item.total),
        taux_non_permanents: pct(item.non_permanents, item.total),
        taux_pr: pct(item.pr, item.total),
        taux_mcf: pct(item.mcf, item.total),
        taux_age_35_moins: pct(item.age_35_moins, item.total),
        taux_age_36_55: pct(item.age_36_55, item.total),
        taux_age_56_plus: pct(item.age_56_plus, item.total),
        taux_temps_plein: pct(item.temps_plein, item.total),
        taux_2nd_degre: pct(item.pers_2nd_degre, item.total),
        total_titulaires: item.titulaires,
        total_ec: item.ec,
        total_non_permanents: item.non_permanents,
      }));

    res.json({ items: result });
  } catch (error) {
    console.error("Error fetching positioning data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
