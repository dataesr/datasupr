import express from "express";
import { db } from "../../../../services/mongo.js";
import { recreateIndex } from "../../../utils.js";
import { ENSEMBLE_DEFAULTS, FILTER_FIELDS, VALUE_MAPS } from "./_common.js";

const router = new express.Router();

const COLLECTION = "outcomes-higher-grad";

const DIPLOMA_ROWS = [
  {
    label: "Licence générale",
    eff: "lg",
    taux: "taux_lg",
    sort: "taux_lg_sort",
    insc: "taux_lg_insc",
  },
  {
    label: "Licence professionnelle",
    eff: "lp",
    taux: "taux_lp",
    sort: "taux_lp_sort",
    insc: "taux_lp_insc",
  },
  {
    label: "BTS",
    eff: "bts",
    taux: "taux_bts",
    sort: "taux_bts_sort",
    insc: "taux_bts_insc",
  },
  {
    label: "DUT/BUT",
    eff: "dut",
    taux: "taux_dut",
    sort: "taux_dut_sort",
    insc: "taux_dut_insc",
  },
  {
    label: "Autres formations",
    eff: "autre",
    taux: "taux_autre",
    sort: "taux_autr_sort",
    insc: "taux_autr_insc",
  },
];

function buildFilters(query) {
  const filters = {};
  FILTER_FIELDS.forEach((field) => {
    filters[field] =
      query[field] && query[field] !== "all"
        ? query[field]
        : ENSEMBLE_DEFAULTS[field];
  });
  return filters;
}

async function getFilterOptions(field, query) {
  const fieldMap = VALUE_MAPS[field] || {};
  const filters = {};
  FILTER_FIELDS.forEach((f) => {
    if (f !== field) {
      filters[f] =
        query[f] && query[f] !== "all" ? query[f] : ENSEMBLE_DEFAULTS[f];
    }
  });

  const results = await db
    .collection(COLLECTION)
    .aggregate([
      { $match: { ...filters, [field]: { $ne: ENSEMBLE_DEFAULTS[field] } } },
      {
        $project: {
          _id: 0,
          key: `$${field}`,
          count: {
            $add: [
              {
                $convert: { input: "$dipl", to: "int", onError: 0, onNull: 0 },
              },
              {
                $convert: {
                  input: "$ndipl",
                  to: "int",
                  onError: 0,
                  onNull: 0,
                },
              },
            ],
          },
        },
      },
      { $sort: { key: 1 } },
    ])
    .toArray();

  return results.map((r) => ({
    count: r.count,
    key: r.key,
    label: fieldMap[r.key] || r.key,
  }));
}

router.route("/outcomes/plus-haut-diplome").get(async (req, res) => {
  if (!req.query.cohorte_annee || !req.query.cohorte_situation) {
    return res
      .status(400)
      .send("cohorte_annee and cohorte_situation are required");
  }

  const filters = buildFilters(req.query);

  try {
    const [doc, ...filterOptionsEntries] = await Promise.all([
      db.collection(COLLECTION).findOne(filters),
      ...FILTER_FIELDS.map((field) => getFilterOptions(field, req.query)),
    ]);

    if (!doc) {
      return res.json({
        cohort: {
          annee: req.query.cohorte_annee,
          situation: req.query.cohorte_situation,
        },
        filterOptions: FILTER_FIELDS.reduce((acc, field, i) => {
          acc[field] = filterOptionsEntries[i];
          return acc;
        }, {}),
        filters,
        lastYear: 4,
        rows: [],
        totalStudents: 0,
        totals: {
          diplomes: {
            effectif: 0,
            pourcentage: 0,
            dontInscrits: 0,
            dontSortants: 0,
          },
          nonDiplomes: {
            effectif: 0,
            pourcentage: 0,
            dontInscrits: 0,
            dontSortants: 0,
          },
        },
      });
    }

    const num = (v) => parseFloat(v) || 0;

    const totalStudents = num(doc.dipl) + num(doc.ndipl);

    const rows = DIPLOMA_ROWS.filter((d) => num(doc[d.eff]) > 0).map((d) => ({
      diplome: d.label,
      effectif: num(doc[d.eff]),
      pourcentage: num(doc[d.taux]),
      dontInscrits: num(doc[d.insc]),
      dontSortants: num(doc[d.sort]),
    }));

    return res.json({
      cohort: {
        annee: req.query.cohorte_annee,
        situation: req.query.cohorte_situation,
      },
      filterOptions: FILTER_FIELDS.reduce((acc, field, i) => {
        acc[field] = filterOptionsEntries[i];
        return acc;
      }, {}),
      filters,
      lastYear: 4,
      rows,
      totalStudents,
      totals: {
        diplomes: {
          effectif: num(doc.dipl),
          pourcentage: num(doc.taux_dipl),
          dontInscrits: num(doc.taux_dipl_insc),
          dontSortants: num(doc.taux_dipl_sort),
        },
        nonDiplomes: {
          effectif: num(doc.ndipl),
          pourcentage: num(doc.taux_ndipl),
          dontInscrits: num(doc.taux_ndipl_insc),
          dontSortants: num(doc.taux_ndipl_sort),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.route("/outcomes/plus-haut-diplome_indexes").get(async (req, res) => {
  try {
    const collection = db.collection(COLLECTION);

    await recreateIndex(
      collection,
      {
        groupe_disciplinaire: 1,
        sexe: 1,
        origine_sociale: 1,
        bac_type: 1,
        bac_mention: 1,
        retard_scolaire: 1,
        devenir_en_un_an: 1,
        type_de_trajectoire: 1,
      },
      "idx_phd_filters"
    );

    res
      .status(201)
      .json({ message: "Index outcomes-higher-grad créés avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création des index:", error);
    res.status(500).json({ error: "Erreur lors de la création des index" });
  }
});

export default router;
