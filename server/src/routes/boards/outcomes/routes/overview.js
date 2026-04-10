import express from "express";
import { db } from "../../../../services/mongo.js";
import { checkQuery } from "../../../utils.js";

const router = new express.Router();

const COLLECTION_NAME = process.env.OUTCOMES_COLLECTION || "outcomes";
const DEFAULT_RELATIVE_YEARS = [0, 1, 2, 3, 4];
const DEFAULT_MIN_VALUE = 100;
const FILTER_FIELDS = [
  "groupe_disciplinaire",
  "sexe",
  "origine_sociale",
  "bac_type",
  "bac_mention",
  "retard_scolaire",
  "devenir_en_un_an",
  "parcours_type",
];

function parseListParam(value) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildSelectedFilters(query) {
  const filters = {
    cohorte_annee: query.cohorte_annee,
    cohorte_situation: query.cohorte_situation,
  };

  FILTER_FIELDS.forEach((field) => {
    if (query[field] && query[field] !== "all") {
      filters[field] = query[field];
    }
  });

  return filters;
}

function buildFilterMatch(query, excludedField) {
  const filters = {
    cohorte_annee: query.cohorte_annee,
    cohorte_situation: query.cohorte_situation,
  };

  FILTER_FIELDS.forEach((field) => {
    if (field !== excludedField && query[field] && query[field] !== "all") {
      filters[field] = query[field];
    }
  });

  return filters;
}

async function getFilterOptions(field, query) {
  return db
    .collection(COLLECTION_NAME)
    .aggregate(
      [
        { $match: buildFilterMatch(query, field) },
        {
          $group: {
            _id: {
              student: "$id_etudiant",
              value: `$${field}`,
            },
          },
        },
        {
          $match: {
            "_id.value": { $nin: [null, ""] },
          },
        },
        {
          $group: {
            _id: "$_id.value",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            count: 1,
            key: "$_id",
            label: "$_id",
          },
        },
        {
          $sort: {
            label: 1,
          },
        },
      ],
      {
        collation: { locale: "fr", strength: 1 },
      }
    )
    .toArray();
}

function buildFluxPipeline(filters, relativeYears, minValue) {
  return [
    { $match: filters },
    {
      $addFields: {
        annee_rel_num: { $toInt: "$annee_rel" },
      },
    },
    {
      $match: {
        annee_rel_num: { $in: relativeYears },
      },
    },
    {
      $group: {
        _id: "$id_etudiant",
        parcours: {
          $push: {
            annee: "$annee",
            annee_rel: "$annee_rel_num",
            situation: "$situation",
          },
        },
      },
    },
    {
      $addFields: {
        parcours: {
          $sortArray: {
            input: "$parcours",
            sortBy: { annee_rel: 1 },
          },
        },
      },
    },
    {
      $project: {
        transitions: {
          $cond: [
            { $gt: [{ $size: "$parcours" }, 1] },
            {
              $map: {
                input: {
                  $range: [0, { $subtract: [{ $size: "$parcours" }, 1] }],
                },
                as: "i",
                in: {
                  source_annee: { $arrayElemAt: ["$parcours.annee", "$$i"] },
                  source_rel: { $arrayElemAt: ["$parcours.annee_rel", "$$i"] },
                  source_situation: {
                    $arrayElemAt: ["$parcours.situation", "$$i"],
                  },
                  target_annee: {
                    $arrayElemAt: ["$parcours.annee", { $add: ["$$i", 1] }],
                  },
                  target_rel: {
                    $arrayElemAt: ["$parcours.annee_rel", { $add: ["$$i", 1] }],
                  },
                  target_situation: {
                    $arrayElemAt: ["$parcours.situation", { $add: ["$$i", 1] }],
                  },
                },
              },
            },
            [],
          ],
        },
      },
    },
    { $unwind: "$transitions" },
    {
      $group: {
        _id: {
          source_annee: "$transitions.source_annee",
          source_rel: "$transitions.source_rel",
          source_situation: "$transitions.source_situation",
          target_annee: "$transitions.target_annee",
          target_rel: "$transitions.target_rel",
          target_situation: "$transitions.target_situation",
        },
        value: { $sum: 1 },
      },
    },
    {
      $match: {
        value: { $gte: minValue },
      },
    },
    {
      $project: {
        _id: 0,
        source_annee: "$_id.source_annee",
        source_rel: "$_id.source_rel",
        source_situation: "$_id.source_situation",
        target_annee: "$_id.target_annee",
        target_rel: "$_id.target_rel",
        target_situation: "$_id.target_situation",
        value: 1,
      },
    },
    {
      $sort: {
        source_rel: 1,
        target_rel: 1,
        value: -1,
      },
    },
  ];
}

router.route("/outcomes/flux").get(async (req, res) => {
  if (!req.query.cohorte_annee || !req.query.cohorte_situation) {
    return res
      .status(400)
      .send("cohorte_annee and cohorte_situation are required");
  }

  const relativeYears = parseListParam(req.query.annee_rel)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value));
  const selectedRelativeYears =
    relativeYears.length > 0 ? relativeYears : DEFAULT_RELATIVE_YEARS;
  const requestedMinValue = Number.parseInt(req.query.min_value, 10);
  const selectedMinValue = Number.isInteger(requestedMinValue)
    ? requestedMinValue
    : DEFAULT_MIN_VALUE;
  const filters = buildSelectedFilters(req.query);

  try {
    const [links, totalStudents, ...filterOptionsEntries] = await Promise.all([
      db
        .collection(COLLECTION_NAME)
        .aggregate(
          buildFluxPipeline(filters, selectedRelativeYears, selectedMinValue)
        )
        .toArray(),
      db
        .collection(COLLECTION_NAME)
        .aggregate([
          { $match: filters },
          { $group: { _id: "$id_etudiant" } },
          { $count: "total" },
        ])
        .toArray(),
      ...FILTER_FIELDS.map((field) => getFilterOptions(field, req.query)),
    ]);

    return res.json({
      cohort: {
        annee: req.query.cohorte_annee,
        situation: req.query.cohorte_situation,
      },
      filterOptions: FILTER_FIELDS.reduce((accumulator, field, index) => {
        accumulator[field] = filterOptionsEntries[index];
        return accumulator;
      }, {}),
      filters,
      links,
      minValue: selectedMinValue,
      relativeYears: selectedRelativeYears,
      totalStudents: totalStudents[0]?.total || 0,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.route("/outcomes/repartition").get(async (req, res) => {
  if (!req.query.cohorte_annee || !req.query.cohorte_situation) {
    return res
      .status(400)
      .send("cohorte_annee and cohorte_situation are required");
  }

  const relativeYears = parseListParam(req.query.annee_rel)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value));
  const selectedRelativeYears =
    relativeYears.length > 0 ? relativeYears : DEFAULT_RELATIVE_YEARS;
  const filters = buildSelectedFilters(req.query);

  try {
    const [distribution, totalStudents, ...filterOptionsEntries] =
      await Promise.all([
        db
          .collection(COLLECTION_NAME)
          .aggregate([
            { $match: filters },
            {
              $addFields: {
                annee_rel_num: { $toInt: "$annee_rel" },
              },
            },
            {
              $match: {
                annee_rel_num: { $in: selectedRelativeYears },
              },
            },
            {
              $group: {
                _id: {
                  annee_rel: "$annee_rel_num",
                  situation: "$situation",
                },
                count: { $addToSet: "$id_etudiant" },
              },
            },
            {
              $project: {
                _id: 0,
                annee_rel: "$_id.annee_rel",
                situation: "$_id.situation",
                count: { $size: "$count" },
              },
            },
            { $sort: { annee_rel: 1, situation: 1 } },
          ])
          .toArray(),
        db
          .collection(COLLECTION_NAME)
          .aggregate([
            { $match: filters },
            { $group: { _id: "$id_etudiant" } },
            { $count: "total" },
          ])
          .toArray(),
        ...FILTER_FIELDS.map((field) => getFilterOptions(field, req.query)),
      ]);

    return res.json({
      cohort: {
        annee: req.query.cohorte_annee,
        situation: req.query.cohorte_situation,
      },
      distribution,
      filterOptions: FILTER_FIELDS.reduce((accumulator, field, index) => {
        accumulator[field] = filterOptionsEntries[index];
        return accumulator;
      }, {}),
      filters,
      relativeYears: selectedRelativeYears,
      totalStudents: totalStudents[0]?.total || 0,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const DIPLOMA_MAP = {
  L3: "Licence générale",
  LP: "Licence professionnelle",
  STS: "BTS",
  IUT: "DUT/BUT",
};

const DIPLOMA_ORDER = [
  "Licence générale",
  "Licence professionnelle",
  "BTS",
  "DUT/BUT",
  "Autres formations",
];

router.route("/outcomes/plus-haut-diplome").get(async (req, res) => {
  if (!req.query.cohorte_annee || !req.query.cohorte_situation) {
    return res
      .status(400)
      .send("cohorte_annee and cohorte_situation are required");
  }

  const filters = buildSelectedFilters(req.query);

  try {
    const [students, ...filterOptionsEntries] = await Promise.all([
      db
        .collection(COLLECTION_NAME)
        .aggregate([
          { $match: filters },
          { $sort: { annee_rel: 1 } },
          {
            $group: {
              _id: "$id_etudiant",
              trajectory: {
                $push: {
                  annee_rel: { $toInt: "$annee_rel" },
                  situation: "$situation",
                },
              },
            },
          },
        ])
        .toArray(),
      ...FILTER_FIELDS.map((field) => getFilterOptions(field, req.query)),
    ]);

    const totalStudents = students.length;
    const diplomaStats = {};
    const totalDiplomes = { effectif: 0, inscrits: 0, sortants: 0 };
    const totalNonDiplomes = { effectif: 0, inscrits: 0, sortants: 0 };

    for (const student of students) {
      const traj = student.trajectory.sort((a, b) => a.annee_rel - b.annee_rel);
      const lastEntry = traj[traj.length - 1];
      const isInscrit = !lastEntry.situation.startsWith("Sortants");

      const diplomaIdx = traj.findIndex(
        (t) => t.situation === "Sortants_diplomes"
      );

      if (diplomaIdx >= 0) {
        const beforeSituation =
          diplomaIdx > 0 ? traj[diplomaIdx - 1].situation : null;
        const diplomaType =
          (beforeSituation && DIPLOMA_MAP[beforeSituation]) ||
          "Autres formations";

        if (!diplomaStats[diplomaType]) {
          diplomaStats[diplomaType] = { effectif: 0, inscrits: 0, sortants: 0 };
        }
        diplomaStats[diplomaType].effectif++;
        if (isInscrit) diplomaStats[diplomaType].inscrits++;
        else diplomaStats[diplomaType].sortants++;

        totalDiplomes.effectif++;
        if (isInscrit) totalDiplomes.inscrits++;
        else totalDiplomes.sortants++;
      } else {
        totalNonDiplomes.effectif++;
        if (isInscrit) totalNonDiplomes.inscrits++;
        else totalNonDiplomes.sortants++;
      }
    }

    const pct = (n) =>
      totalStudents ? +((n / totalStudents) * 100).toFixed(1) : 0;

    const rows = DIPLOMA_ORDER.filter((d) => diplomaStats[d]).map(
      (diplome) => ({
        diplome,
        effectif: diplomaStats[diplome].effectif,
        pourcentage: pct(diplomaStats[diplome].effectif),
        dontInscrits: pct(diplomaStats[diplome].inscrits),
        dontSortants: pct(diplomaStats[diplome].sortants),
      })
    );

    const lastYear =
      students.length > 0
        ? students[0].trajectory.sort((a, b) => b.annee_rel - a.annee_rel)[0]
            .annee_rel
        : 4;

    return res.json({
      cohort: {
        annee: req.query.cohorte_annee,
        situation: req.query.cohorte_situation,
      },
      filterOptions: FILTER_FIELDS.reduce((accumulator, field, index) => {
        accumulator[field] = filterOptionsEntries[index];
        return accumulator;
      }, {}),
      filters,
      lastYear,
      rows,
      totalStudents,
      totals: {
        diplomes: {
          effectif: totalDiplomes.effectif,
          pourcentage: pct(totalDiplomes.effectif),
          dontInscrits: pct(totalDiplomes.inscrits),
          dontSortants: pct(totalDiplomes.sortants),
        },
        nonDiplomes: {
          effectif: totalNonDiplomes.effectif,
          pourcentage: pct(totalNonDiplomes.effectif),
          dontInscrits: pct(totalNonDiplomes.inscrits),
          dontSortants: pct(totalNonDiplomes.sortants),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.route("/outcomes/overview/test").get(async (req, res) => {
  const filters = checkQuery(req.query, ["name"], res);

  res.json({
    status: 200,
    filters,
  });
});

export default router;
