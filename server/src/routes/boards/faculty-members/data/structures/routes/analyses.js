import { Router } from "express";
import { getCollection, buildMatchStage } from "../helpers.js";

const router = Router();

router.get("/faculty-members/analyses", async (req, res) => {
  try {
    const { view, id, age_class } = req.query;
    const collection = getCollection();
    const match = buildMatchStage(view, id);
    const matchEc = { ...match, is_enseignant_chercheur: true };
    const matchAge = age_class ? { ...match, classe_age3: age_class } : match;
    const matchEcAge = age_class
      ? { ...matchEc, classe_age3: age_class }
      : matchEc;

    const [
      globalAgg,
      statusGenderAgg,
      catBreakdownAgg,
      quotiteGenderAgg,
      ageAgg,
      ageGenderAgg,
      discYearAgg,
      discGenderAgg,
      cnuGroupYearAgg,
      cnuSectionTopAgg,
    ] = await Promise.all([
      collection
        .aggregate([
          { $match: matchAge },
          {
            $group: {
              _id: { year: "$annee_universitaire", g: "$sexe" },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              total: { $sum: "$c" },
              genders: { $push: { g: "$_id.g", c: "$c" } },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAge },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                g: "$sexe",
                status: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$is_enseignant_chercheur", true] },
                        then: "ec",
                      },
                      {
                        case: {
                          $and: [
                            { $eq: ["$is_titulaire", true] },
                            { $eq: ["$is_enseignant_chercheur", false] },
                          ],
                        },
                        then: "tit",
                      },
                    ],
                    default: "non_tit",
                  },
                },
              },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              breakdown: {
                $push: { g: "$_id.g", status: "$_id.status", c: "$c" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAge },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                g: "$sexe",
                cat: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $and: [
                            { $eq: ["$is_enseignant_chercheur", true] },
                            { $eq: ["$code_categorie_assimil", "PR"] },
                          ],
                        },
                        then: "pr",
                      },
                      {
                        case: { $eq: ["$is_enseignant_chercheur", true] },
                        then: "mcf",
                      },
                      {
                        case: {
                          $and: [
                            { $eq: ["$is_titulaire", true] },
                            { $eq: ["$is_enseignant_chercheur", false] },
                          ],
                        },
                        then: "tit_non_ec",
                      },
                    ],
                    default: "non_perm",
                  },
                },
              },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              breakdown: {
                $push: { g: "$_id.g", cat: "$_id.cat", c: "$c" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAge },
          {
            $group: {
              _id: { year: "$annee_universitaire", g: "$sexe", q: "$quotite" },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              breakdown: { $push: { g: "$_id.g", q: "$_id.q", c: "$c" } },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: { year: "$annee_universitaire", age: "$classe_age3" },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              ages: { $push: { age: "$_id.age", c: "$c" } },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                age: "$classe_age3",
                g: "$sexe",
              },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              breakdown: {
                $push: { age: "$_id.age", g: "$_id.g", c: "$c" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAge },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                code: "$code_grande_discipline",
                name: "$grande_discipline",
              },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              discs: {
                $push: { code: "$_id.code", name: "$_id.name", c: "$c" },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchAge },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                code: "$code_grande_discipline",
                g: "$sexe",
              },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              breakdown: { $push: { code: "$_id.code", g: "$_id.g", c: "$c" } },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchEcAge },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                code: "$code_groupe_cnu",
                name: "$groupe_cnu",
                g: "$sexe",
              },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.year",
              groups: {
                $push: {
                  code: "$_id.code",
                  name: "$_id.name",
                  g: "$_id.g",
                  c: "$c",
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: { ...matchEcAge, code_section_cnu: { $ne: 0 } } },
          {
            $group: {
              _id: {
                year: "$annee_universitaire",
                code: "$code_section_cnu",
                name: "$section_cnu",
                g: "$sexe",
              },
              c: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: { code: "$_id.code", name: "$_id.name" },
              total: { $sum: "$c" },
              yearly: { $push: { year: "$_id.year", g: "$_id.g", c: "$c" } },
            },
          },
          { $sort: { total: -1 } },
        ])
        .toArray(),
    ]);

    const discCodesMap = new Map();
    discYearAgg.forEach((e) =>
      e.discs.forEach((d) => {
        if (d.code != null)
          discCodesMap.set(String(d.code), d.name || String(d.code));
      })
    );

    const discTotals = new Map();
    discYearAgg.forEach((e) =>
      e.discs.forEach((d) => {
        const k = String(d.code);
        discTotals.set(k, (discTotals.get(k) || 0) + d.c);
      })
    );
    const discCodes = [...discCodesMap.keys()].sort(
      (a, b) => (discTotals.get(b) || 0) - (discTotals.get(a) || 0)
    );

    const cnuGroupCodesMap = new Map();
    cnuGroupYearAgg.forEach((e) =>
      e.groups.forEach((g) => {
        if (g.code != null)
          cnuGroupCodesMap.set(String(g.code), g.name || String(g.code));
      })
    );

    const cnuGroupTotals = new Map();
    cnuGroupYearAgg.forEach((e) =>
      e.groups.forEach((g) => {
        const k = String(g.code);
        cnuGroupTotals.set(k, (cnuGroupTotals.get(k) || 0) + g.c);
      })
    );
    const cnuGroupCodes = [...cnuGroupCodesMap.keys()].sort(
      (a, b) => (cnuGroupTotals.get(b) || 0) - (cnuGroupTotals.get(a) || 0)
    );

    const cnuSections = cnuSectionTopAgg.map((s) => ({
      code: String(s._id.code),
      name: s._id.name,
      total: s.total,
      yearly: s.yearly,
    }));

    const allYears = [...new Set(globalAgg.map((e) => e._id))].sort();

    const globalByYear = Object.fromEntries(globalAgg.map((e) => [e._id, e]));
    const statusByYear = Object.fromEntries(
      statusGenderAgg.map((e) => [e._id, e])
    );
    const catByYear = Object.fromEntries(
      catBreakdownAgg.map((e) => [e._id, e])
    );
    const quotiteByYear = Object.fromEntries(
      quotiteGenderAgg.map((e) => [e._id, e])
    );
    const ageByYear = Object.fromEntries(ageAgg.map((e) => [e._id, e]));
    const ageGenderByYear = Object.fromEntries(
      ageGenderAgg.map((e) => [e._id, e])
    );
    const discByYear = Object.fromEntries(discYearAgg.map((e) => [e._id, e]));
    const discGenderByYear = Object.fromEntries(
      discGenderAgg.map((e) => [e._id, e])
    );
    const cnuGroupByYear = Object.fromEntries(
      cnuGroupYearAgg.map((e) => [e._id, e])
    );

    const AGE_LABELS = {
      "35 ans et moins": "effectif_age_35_moins",
      "36 à 55 ans": "effectif_age_36_55",
      "56 ans et plus": "effectif_age_56_plus",
    };

    const records = allYears.map((year) => {
      const g = globalByYear[year] || {};
      const s = statusByYear[year] || {};
      const q = quotiteByYear[year] || {};
      const a = ageByYear[year] || {};
      const ag = ageGenderByYear[year] || {};
      const d = discByYear[year] || {};
      const dg = discGenderByYear[year] || {};
      const cg = cnuGroupByYear[year] || {};
      const cb = catByYear[year] || {};
      const total = g.total || 0;

      const femmes = (g.genders || []).find((x) => x.g === "Féminin")?.c || 0;
      const hommes = (g.genders || []).find((x) => x.g === "Masculin")?.c || 0;

      const sumStatus = (status, gender) =>
        (s.breakdown || [])
          .filter((x) => x.status === status && (!gender || x.g === gender))
          .reduce((acc, x) => acc + x.c, 0);

      const effectif_ec = sumStatus("ec");
      const effectif_tit_non_ec = sumStatus("tit");
      const effectif_non_titulaire = sumStatus("non_tit");
      const effectif_permanents = effectif_ec + effectif_tit_non_ec;
      const femmes_ec = sumStatus("ec", "Féminin");
      const femmes_perm =
        sumStatus("ec", "Féminin") + sumStatus("tit", "Féminin");
      const femmes_non_tit = sumStatus("non_tit", "Féminin");

      const sumCat = (cat, gender) =>
        (cb.breakdown || [])
          .filter((x) => x.cat === cat && (!gender || x.g === gender))
          .reduce((acc, x) => acc + x.c, 0);

      const effectif_pr = sumCat("pr");
      const effectif_mcf = sumCat("mcf");
      const femmes_pr = sumCat("pr", "Féminin");
      const femmes_mcf = sumCat("mcf", "Féminin");

      const sumQ = (isPlein, gender) =>
        (q.breakdown || [])
          .filter(
            (x) =>
              (isPlein ? x.q === "Temps plein" : x.q !== "Temps plein") &&
              (!gender || x.g === gender)
          )
          .reduce((acc, x) => acc + x.c, 0);
      const effectif_temps_plein = sumQ(true);
      const effectif_temps_partiel = sumQ(false);
      const tp_femmes = sumQ(true, "Féminin");
      const tp_hommes = sumQ(true, "Masculin");

      const ageFields = {};
      Object.entries(AGE_LABELS).forEach(([label, key]) => {
        ageFields[key] = (a.ages || []).find((x) => x.age === label)?.c || 0;
      });

      const ageGenderFields = {};
      const AGE_PYRAMID_LABELS = {
        "35 ans et moins": "age_35_moins",
        "36 à 55 ans": "age_36_55",
        "56 ans et plus": "age_56_plus",
      };
      Object.entries(AGE_PYRAMID_LABELS).forEach(([label, key]) => {
        ageGenderFields[`${key}_f`] = (ag.breakdown || [])
          .filter((x) => x.age === label && x.g === "Féminin")
          .reduce((acc, x) => acc + x.c, 0);
        ageGenderFields[`${key}_h`] = (ag.breakdown || [])
          .filter((x) => x.age === label && x.g === "Masculin")
          .reduce((acc, x) => acc + x.c, 0);
      });

      const discFields = {};
      (d.discs || []).forEach((disc) => {
        discFields[`disc_${disc.code}`] = disc.c;
      });

      const discGenderFields = {};
      discCodes.forEach((code) => {
        discGenderFields[`disc_f_${code}`] = (dg.breakdown || [])
          .filter((x) => String(x.code) === code && x.g === "Féminin")
          .reduce((acc, x) => acc + x.c, 0);
        discGenderFields[`disc_h_${code}`] = (dg.breakdown || [])
          .filter((x) => String(x.code) === code && x.g === "Masculin")
          .reduce((acc, x) => acc + x.c, 0);
      });

      const cnuGroupsByCode = {};
      (cg.groups || []).forEach((group) => {
        const k = String(group.code);
        cnuGroupsByCode[k] = cnuGroupsByCode[k] || { total: 0, femmes: 0 };
        cnuGroupsByCode[k].total += group.c;
        if (group.g === "Féminin") cnuGroupsByCode[k].femmes += group.c;
      });
      const cnuGroupFields = {};
      const cnuGroupGenderFields = {};
      cnuGroupCodes.forEach((code) => {
        const tot = cnuGroupsByCode[code]?.total || 0;
        const fem = cnuGroupsByCode[code]?.femmes || 0;
        cnuGroupFields[`cnu_g_${code}`] = tot;
        cnuGroupGenderFields[`cnu_g_f_${code}`] = fem;
        cnuGroupGenderFields[`cnu_g_h_${code}`] = tot - fem;
      });

      const cnuSectFields = {};
      cnuSections.forEach((sect) => {
        const yearEntries = (sect.yearly || []).filter((y) => y.year === year);
        cnuSectFields[`cnu_s_f_${sect.code}`] = yearEntries
          .filter((y) => y.g === "Féminin")
          .reduce((acc, y) => acc + y.c, 0);
        cnuSectFields[`cnu_s_h_${sect.code}`] = yearEntries
          .filter((y) => y.g === "Masculin")
          .reduce((acc, y) => acc + y.c, 0);
      });

      const pct = (num, den) => (den > 0 ? (num / den) * 100 : 0);

      return {
        annee_universitaire: year,
        effectif_total: total,
        effectif_femmes: femmes,
        effectif_hommes: hommes,
        taux_feminisation: pct(femmes, total),
        effectif_ec,
        effectif_tit_non_ec,
        effectif_non_titulaire,
        effectif_permanents,
        effectif_pr,
        effectif_mcf,
        taux_permanents: pct(effectif_permanents, total),
        taux_ec: pct(effectif_ec, total),
        taux_ec_sur_permanents: pct(effectif_ec, effectif_permanents),
        taux_pr_sur_ec: pct(effectif_pr, effectif_ec),
        taux_feminisation_ec: pct(femmes_ec, effectif_ec),
        taux_feminisation_pr: pct(femmes_pr, effectif_pr),
        taux_feminisation_mcf: pct(femmes_mcf, effectif_mcf),
        taux_feminisation_permanents: pct(femmes_perm, effectif_permanents),
        taux_feminisation_non_titulaires: pct(
          femmes_non_tit,
          effectif_non_titulaire
        ),
        effectif_temps_plein,
        effectif_temps_partiel,
        taux_temps_partiel: pct(effectif_temps_partiel, total),
        taux_temps_partiel_femmes:
          femmes > 0 ? ((femmes - tp_femmes) / femmes) * 100 : 0,
        taux_temps_partiel_hommes:
          hommes > 0 ? ((hommes - tp_hommes) / hommes) * 100 : 0,
        ...ageFields,
        ...ageGenderFields,
        taux_age_35_moins: pct(ageFields.effectif_age_35_moins || 0, total),
        taux_age_56_plus: pct(ageFields.effectif_age_56_plus || 0, total),
        ...discFields,
        ...discGenderFields,
        ...cnuGroupFields,
        ...cnuGroupGenderFields,
        ...cnuSectFields,
      };
    });

    res.json({
      records,
      disc_labels: Object.fromEntries(discCodesMap),
      disc_codes: discCodes,
      cnu_group_labels: Object.fromEntries(cnuGroupCodesMap),
      cnu_group_codes: cnuGroupCodes,
      cnu_sections: cnuSections.map(({ code, name, total }) => ({
        code,
        name,
        total,
      })),
    });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
