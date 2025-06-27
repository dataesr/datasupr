import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/structures", async (req, res) => {
  try {
    const collection = db.collection("faculty-members_main_staging");

    const structures = await collection
      .aggregate([
        {
          $group: {
            _id: {
              id: "$etablissement_id_paysage_actuel",
              lib: "$etablissement_lib",
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            lib: "$_id.lib",
          },
        },
        {
          $match: {
            id: { $ne: null },
            lib: { $ne: null },
          },
        },
        {
          $sort: { lib: 1 },
        },
      ])
      .toArray();

    res.json({
      structures: structures,
    });
  } catch (error) {
    console.error("Error fetching structures:", error);
    res.status(500).json({
      error: "Server error while fetching structures",
    });
  }
});

router.get("/faculty-members/structures/overview", async (req, res) => {
  try {
    const { annee_universitaire, structure_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;
    if (structure_id) {
      matchStage.$or = [
        { etablissement_id_paysage: structure_id },
        { etablissement_id_paysage_actuel: structure_id },
      ];
    }
    // Le genre par discipline
    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$sexe",
            count: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    let contextInfo = null;
    if (structure_id) {
      const structureInfo = await collection.findOne(
        {
          $or: [
            { etablissement_id_paysage: structure_id },
            { etablissement_id_paysage_actuel: structure_id },
          ],
        },
        {
          projection: {
            etablissement_lib: 1,
            etablissement_actuel_lib: 1,
            etablissement_id_paysage_actuel: 1,
            etablissement_type: 1,
            etablissement_region: 1,
          },
        }
      );

      if (structureInfo) {
        contextInfo = {
          id: structureInfo.etablissement_id_paysage_actuel || structure_id,
          name:
            structureInfo.etablissement_actuel_lib ||
            structureInfo.etablissement_lib ||
            "Nom de l'université inconnu",
          type: "structure",
          structure_type: structureInfo.etablissement_type || "Type inconnu",
          region: structureInfo.etablissement_region || "Région inconnue",
        };
      }
    }
    const establishmentTypeDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              establishment_type: "$etablissement_type",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: "$_id.establishment_type",
            total_count: { $sum: "$count" },
            gender_breakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },

        {
          $sort: {
            sortOrder: 1,
            total_count: -1,
          },
        },
        {
          $project: {
            sortOrder: 0,
          },
        },
      ])
      .toArray();

    // La répartition des personnels par catégorie
    const personnalCategoryDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$categorie_personnels",
            count: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    // L'âge par discipline
    const ageDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$classe_age3",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // Le nombre d'enseignants par discipline par discipline
    const discipline_distribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              discipline_code: "$code_grande_discipline",
              discipline_name: "$grande_discipline",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
            },
            total_count: { $sum: "$count" },
            gender_breakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    const structureStatusDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              structure_code: "$etablissement_id_paysage_actuel",
              structure_name: "$etablissement_actuel_lib",
              status: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$is_enseignant_chercheur", true] },
                      then: "enseignant_chercheur",
                    },
                    {
                      case: {
                        $and: [
                          { $eq: ["$is_titulaire", true] },
                          { $eq: ["$is_enseignant_chercheur", false] },
                        ],
                      },
                      then: "titulaire_non_chercheur",
                    },
                    {
                      case: { $eq: ["$is_titulaire", false] },
                      then: "non_titulaire",
                    },
                  ],
                  default: "non_titulaire",
                },
              },
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              structure_code: "$_id.structure_code",
              structure_name: "$_id.structure_name",
            },
            total_count: { $sum: "$count" },
            status_breakdown: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    const structureGenderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              structure_code: "$etablissement_id_paysage_actuel",
              structure_name: "$etablissement_actuel_lib",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              structure_code: "$_id.structure_code",
              structure_name: "$_id.structure_name",
            },
            total_count: { $sum: "$count" },
            gender_breakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    // Le nombre d'enseignants titulaire par discipline
    const permanentDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$is_titulaire",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Le nombre d'enseignants chercheur par discipline
    const quotiteDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$quotite",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Le nombre d'enseignants chercheur par discipline
    const researcherDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$is_enseignant_chercheur",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Total
    const totalCount = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: "$effectif" },
          },
        },
      ])
      .toArray();

    res.json({
      gender_distribution: genderDistribution,
      age_distribution: ageDistribution,
      context_info: contextInfo,
      establishmentTypeDistribution: establishmentTypeDistribution,
      structureGenderDistribution: structureGenderDistribution,
      structureStatusDistribution: structureStatusDistribution,
      personnalCategoryDistribution: personnalCategoryDistribution,
      discipline_distribution: discipline_distribution,
      permanentDistribution: permanentDistribution,
      quotiteDistribution: quotiteDistribution,
      researcherDistribution: researcherDistribution,
      total_count: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching structures overview:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/structures/cnu-analysis", async (req, res) => {
  try {
    const { annee_universitaire, structure_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    let matchStage = {};
    if (annee_universitaire && annee_universitaire !== "all") {
      matchStage.annee_universitaire = annee_universitaire;
    }

    if (structure_id) {
      matchStage.$or = [
        { etablissement_id_paysage: structure_id },
        { etablissement_id_paysage_actuel: structure_id },
      ];
    }

    const cnuGroupsWithSections = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              discipline_code: "$code_grande_discipline",
              discipline_name: "$grande_discipline",
              group_code: "$code_groupe_cnu",
              group_name: "$groupe_cnu",
              section_code: "$code_section_cnu",
              section_name: "$section_cnu",
              gender: "$sexe",
              age_range: "$classe_age3",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
              section_code: "$_id.section_code",
              section_name: "$_id.section_name",
            },
            details: {
              $push: {
                gender: "$_id.gender",
                age_range: "$_id.age_range",
                count: "$count",
              },
            },
            section_total: { $sum: "$count" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
            },
            sections: {
              $push: {
                section_code: "$_id.section_code",
                section_name: "$_id.section_name",
                section_total: "$section_total",
                details: "$details",
              },
            },
            group_total: { $sum: "$section_total" },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
            },
            groups: {
              $push: {
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
                group_total: "$group_total",
                sections: "$sections",
              },
            },
            discipline_total: { $sum: "$group_total" },
          },
        },
        { $sort: { discipline_total: -1 } },
      ])
      .toArray();

    res.json({
      cnu_groups_with_sections: cnuGroupsWithSections,
      annee_universitaire: annee_universitaire || "current",
      structure_id: structure_id || null,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données CNU structures:",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des données CNU structures",
      error: error.message,
    });
  }
});

router.get(
  "/faculty-members/structures/research-teachers",
  async (req, res) => {
    try {
      const { annee_universitaire, structure_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {
        is_enseignant_chercheur: true,
      };
      if (annee_universitaire)
        matchStage.annee_universitaire = annee_universitaire;
      if (structure_id) {
        matchStage.$or = [
          { etablissement_id_paysage: structure_id },
          { etablissement_id_paysage_actuel: structure_id },
        ];
      }

      if (structure_id) {
        const structureInfo = await collection.findOne(
          {
            $or: [
              { etablissement_id_paysage: structure_id },
              { etablissement_id_paysage_actuel: structure_id },
            ],
          },
          {
            projection: {
              etablissement_lib: 1,
              etablissement_id_paysage: 1,
              etablissement_id_paysage_actuel: 1,
            },
          }
        );

        const cnuData = await collection
          .aggregate([
            { $match: matchStage },
            {
              $group: {
                _id: {
                  group_code: "$code_groupe_cnu",
                  group_name: "$groupe_cnu",
                  section_code: "$code_section_cnu",
                  section_name: "$section_cnu",
                  gender: "$sexe",
                  age_class: "$classe_age3",
                },
                count: { $sum: "$effectif" },
              },
            },
            {
              $group: {
                _id: {
                  group_code: "$_id.group_code",
                  group_name: "$_id.group_name",
                  section_code: "$_id.section_code",
                  section_name: "$_id.section_name",
                },
                totalCount: { $sum: "$count" },
                genderBreakdown: {
                  $push: {
                    gender: "$_id.gender",
                    count: "$count",
                  },
                },
                ageBreakdown: {
                  $push: {
                    age_class: "$_id.age_class",
                    count: "$count",
                  },
                },
              },
            },
            { $sort: { totalCount: -1 } },
          ])
          .toArray();

        const cnuGroups = new Map();

        cnuData.forEach((item) => {
          const groupCode = item._id.group_code;
          const groupName = item._id.group_name;
          const sectionCode = item._id.section_code;
          const sectionName = item._id.section_name;

          if (!cnuGroups.has(groupCode)) {
            cnuGroups.set(groupCode, {
              cnuGroupId: groupCode,
              cnuGroupLabel: groupName,
              maleCount: 0,
              femaleCount: 0,
              totalCount: 0,
              cnuSections: [],
              ageDistribution: [
                { ageClass: "35 ans et moins", count: 0, percent: "0" },
                { ageClass: "36 à 55 ans", count: 0, percent: "0" },
                { ageClass: "56 ans et plus", count: 0, percent: "0" },
                { ageClass: "Non précisé", count: 0, percent: "0" },
              ],
            });
          }

          const group = cnuGroups.get(groupCode);

          const maleCount =
            item.genderBreakdown.find((g) => g.gender === "Masculin")?.count ||
            0;
          const femaleCount =
            item.genderBreakdown.find((g) => g.gender === "Féminin")?.count ||
            0;

          const ageDistribution = [
            "35 ans et moins",
            "36 à 55 ans",
            "56 ans et plus",
            "Non précisé",
          ].map((ageClass) => {
            const ageData = item.ageBreakdown.find(
              (a) => a.age_class === ageClass
            );
            const count = ageData?.count || 0;
            const percent =
              item.totalCount > 0
                ? ((count / item.totalCount) * 100).toFixed(1)
                : "0";

            const groupAgeItem = group.ageDistribution.find(
              (a) => a.ageClass === ageClass
            );
            if (groupAgeItem) {
              groupAgeItem.count += count;
            }
            return { ageClass, count, percent };
          });

          group.cnuSections.push({
            cnuSectionId: sectionCode,
            cnuSectionLabel: sectionName,
            maleCount: maleCount,
            femaleCount: femaleCount,
            totalCount: item.totalCount,
            ageDistribution: ageDistribution,
          });

          group.maleCount += maleCount;
          group.femaleCount += femaleCount;
          group.totalCount += item.totalCount;
        });

        cnuGroups.forEach((group) => {
          group.ageDistribution.forEach((ageItem) => {
            ageItem.percent =
              group.totalCount > 0
                ? ((ageItem.count / group.totalCount) * 100).toFixed(1)
                : "0";
          });
        });
        const genderData = await collection
          .aggregate([
            { $match: matchStage },
            {
              $group: {
                _id: "$sexe",
                count: { $sum: "$effectif" },
              },
            },
          ])
          .toArray();

        const totalCount = genderData.reduce(
          (sum, item) => sum + item.count,
          0
        );
        const maleCount =
          genderData.find((item) => item._id === "Masculin")?.count || 0;
        const femaleCount =
          genderData.find((item) => item._id === "Féminin")?.count || 0;

        // Disciplines dans cet établissement
        const disciplinesData = await collection
          .aggregate([
            { $match: matchStage },
            {
              $group: {
                _id: {
                  field_id: "$code_grande_discipline",
                  fieldLabel: "$grande_discipline",
                  gender: "$sexe",
                },
                count: { $sum: "$effectif" },
              },
            },
            {
              $group: {
                _id: {
                  field_id: "$_id.field_id",
                  fieldLabel: "$_id.fieldLabel",
                },
                totalCount: { $sum: "$count" },
                genderBreakdown: {
                  $push: {
                    gender: "$_id.gender",
                    count: "$count",
                  },
                },
              },
            },
            { $sort: { totalCount: -1 } },
          ])
          .toArray();

        const fields = disciplinesData.map((item) => {
          const maleCount =
            item.genderBreakdown.find((g) => g.gender === "Masculin")?.count ||
            0;
          const femaleCount =
            item.genderBreakdown.find((g) => g.gender === "Féminin")?.count ||
            0;

          return {
            field_id: item._id.field_id,
            fieldLabel: item._id.fieldLabel,
            maleCount: maleCount,
            femaleCount: femaleCount,
            totalCount: item.totalCount,
          };
        });

        res.json({
          structure_id: structure_id,
          structureName:
            structureInfo?.etablissement_lib || "Établissement inconnu",
          maleCount: maleCount,
          femaleCount: femaleCount,
          totalCount: totalCount,
          fields: fields,
          cnuGroups: Array.from(cnuGroups.values()), // ✅ AJOUTÉ ICI
        });
      } else {
        // CAS GLOBAL : Tous les établissements
        const structuresData = await collection
          .aggregate([
            { $match: matchStage },
            {
              $group: {
                _id: {
                  structure_id: "$etablissement_id_paysage",
                  structureName: "$etablissement_lib",
                  gender: "$sexe",
                },
                count: { $sum: "$effectif" },
              },
            },
            {
              $group: {
                _id: {
                  structure_id: "$_id.structure_id",
                  structureName: "$_id.structureName",
                },
                totalCount: { $sum: "$count" },
                genderBreakdown: {
                  $push: {
                    gender: "$_id.gender",
                    count: "$count",
                  },
                },
              },
            },
            { $sort: { totalCount: -1 } },
          ])
          .toArray();

        const structures = structuresData.map((item) => {
          const maleCount =
            item.genderBreakdown.find((g) => g.gender === "Masculin")?.count ||
            0;
          const femaleCount =
            item.genderBreakdown.find((g) => g.gender === "Féminin")?.count ||
            0;

          return {
            structure_id: item._id.structure_id,
            structureName: item._id.structureName,
            maleCount: maleCount,
            femaleCount: femaleCount,
            totalCount: item.totalCount,
          };
        });

        const totalCount = structures.reduce(
          (sum, structure) => sum + structure.totalCount,
          0
        );
        const maleCount = structures.reduce(
          (sum, structure) => sum + structure.maleCount,
          0
        );
        const femaleCount = structures.reduce(
          (sum, structure) => sum + structure.femaleCount,
          0
        );

        // RÉPONSE SANS CNU GROUPS (vue globale)
        res.json({
          totalCount: totalCount,
          maleCount: maleCount,
          femaleCount: femaleCount,
          structures: structures, // ✅ CORRIGÉ
        });
      }
    } catch (error) {
      console.error("Error fetching research teachers by structures:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/faculty-members/structures/evolution", async (req, res) => {
  try {
    const { structure_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (structure_id) {
      matchStage.$or = [
        { etablissement_id_paysage: structure_id },
        { etablissement_id_paysage_actuel: structure_id },
      ];
    }

    const [
      years,
      globalEvolution,
      statusEvolution,
      ageEvolution,
      structureEvolution,
      disciplineEvolution,
      establishmentTypeEvolution,
      personnelCategoryEvolution,
      contextInfo,
    ] = await Promise.all([
      collection
        .distinct("annee_universitaire", matchStage)
        .then((years) => years.filter((y) => y != null).sort()),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$annee_universitaire",
              total_count: { $sum: "$effectif" },
              male_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Masculin"] }, "$effectif", 0],
                },
              },
              female_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0],
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$annee_universitaire",
              total_count: { $sum: "$effectif" },
              enseignant_chercheur_count: {
                $sum: {
                  $cond: [
                    { $eq: ["$is_enseignant_chercheur", true] },
                    "$effectif",
                    0,
                  ],
                },
              },
              titulaire_non_chercheur_count: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$is_titulaire", true] },
                        { $eq: ["$is_enseignant_chercheur", false] },
                      ],
                    },
                    "$effectif",
                    0,
                  ],
                },
              },
              non_titulaire_count: {
                $sum: {
                  $cond: [{ $eq: ["$is_titulaire", false] }, "$effectif", 0],
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                annee_universitaire: "$annee_universitaire",
                age_class: "$classe_age3",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.annee_universitaire",
              total_count: { $sum: "$count" },
              age_breakdown: {
                $push: {
                  age_class: "$_id.age_class",
                  count: "$count",
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      !structure_id
        ? collection
            .aggregate([
              { $match: matchStage },
              {
                $group: {
                  _id: {
                    annee_universitaire: "$annee_universitaire",
                    structure_id: "$etablissement_id_paysage_actuel",
                    structure_name: "$etablissement_actuel_lib",
                  },
                  total_count: { $sum: "$effectif" },
                  male_count: {
                    $sum: {
                      $cond: [{ $eq: ["$sexe", "Masculin"] }, "$effectif", 0],
                    },
                  },
                  female_count: {
                    $sum: {
                      $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0],
                    },
                  },
                },
              },
              {
                $match: {
                  "_id.structure_id": { $ne: null },
                  "_id.structure_name": { $ne: null },
                },
              },
              { $sort: { "_id.annee_universitaire": 1, total_count: -1 } },
              { $limit: 100 },
            ])
            .toArray()
        : Promise.resolve([]),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                annee_universitaire: "$annee_universitaire",
                discipline_code: "$code_grande_discipline",
                discipline_name: "$grande_discipline",
              },
              total_count: { $sum: "$effectif" },
              male_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Masculin"] }, "$effectif", 0],
                },
              },
              female_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0],
                },
              },
            },
          },
          {
            $match: {
              "_id.discipline_code": { $ne: null },
              "_id.discipline_name": { $ne: null },
            },
          },
          { $sort: { "_id.annee_universitaire": 1, total_count: -1 } },
          { $limit: 80 },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                annee_universitaire: "$annee_universitaire",
                establishment_type: "$etablissement_type",
              },
              total_count: { $sum: "$effectif" },
              male_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Masculin"] }, "$effectif", 0],
                },
              },
              female_count: {
                $sum: {
                  $cond: [{ $eq: ["$sexe", "Féminin"] }, "$effectif", 0],
                },
              },
            },
          },
          { $sort: { "_id.annee_universitaire": 1, total_count: -1 } },
          { $limit: 50 },
        ])
        .toArray(),

      collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                annee_universitaire: "$annee_universitaire",
                category: "$categorie_personnels",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.annee_universitaire",
              total_count: { $sum: "$count" },
              category_breakdown: {
                $push: {
                  category: "$_id.category",
                  count: "$count",
                },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      structure_id
        ? collection.findOne(
            {
              $or: [
                { etablissement_id_paysage: structure_id },
                { etablissement_id_paysage_actuel: structure_id },
              ],
            },
            {
              projection: {
                etablissement_lib: 1,
                etablissement_actuel_lib: 1,
                etablissement_id_paysage_actuel: 1,
                etablissement_type: 1,
                etablissement_region: 1,
              },
            }
          )
        : Promise.resolve(null),
    ]);

    const processedGlobalEvolution = globalEvolution.map((item) => ({
      _id: item._id,
      total_count: item.total_count,
      gender_breakdown: [
        { gender: "Masculin", count: item.male_count },
        { gender: "Féminin", count: item.female_count },
      ].filter((g) => g.count > 0),
    }));

    const processedStatusEvolution = statusEvolution.map((item) => ({
      _id: item._id,
      total_count: item.total_count,
      status_breakdown: [
        {
          status: "enseignant_chercheur",
          count: item.enseignant_chercheur_count,
        },
        {
          status: "titulaire_non_chercheur",
          count: item.titulaire_non_chercheur_count,
        },
        { status: "non_titulaire", count: item.non_titulaire_count },
      ].filter((s) => s.count > 0),
    }));

    const processedStructureEvolution = structureEvolution
      .sort((a, b) => b.total_count - a.total_count)
      .map((item) => ({
        _id: item._id,
        total_count: item.total_count,
        gender_breakdown: [
          { gender: "Masculin", count: item.male_count },
          { gender: "Féminin", count: item.female_count },
        ].filter((g) => g.count > 0),
      }));

    const processedDisciplineEvolution = disciplineEvolution
      .sort((a, b) => b.total_count - a.total_count)
      .slice(0, 10)
      .map((item) => ({
        _id: item._id,
        total_count: item.total_count,
        gender_breakdown: [
          { gender: "Masculin", count: item.male_count },
          { gender: "Féminin", count: item.female_count },
        ].filter((g) => g.count > 0),
      }));

    const processedEstablishmentTypeEvolution = establishmentTypeEvolution.map(
      (item) => ({
        _id: item._id,
        total_count: item.total_count,
        gender_breakdown: [
          { gender: "Masculin", count: item.male_count },
          { gender: "Féminin", count: item.female_count },
        ].filter((g) => g.count > 0),
      })
    );

    let processedContextInfo = null;
    if (structure_id && contextInfo) {
      processedContextInfo = {
        id: contextInfo.etablissement_id_paysage_actuel,
        name:
          contextInfo.etablissement_actuel_lib || contextInfo.etablissement_lib,
        type: "structure",
        structure_type: contextInfo.etablissement_type,
        region: contextInfo.etablissement_region,
      };
    }

    res.json({
      context_info: processedContextInfo,
      years: years,
      global_evolution: processedGlobalEvolution,
      status_evolution: processedStatusEvolution,
      age_evolution: ageEvolution,
      structure_evolution: processedStructureEvolution,
      discipline_evolution: processedDisciplineEvolution,
      establishment_type_evolution: processedEstablishmentTypeEvolution,
      personnel_category_evolution: personnelCategoryEvolution,
    });
  } catch (error) {
    console.error("Error fetching structures evolution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/structures/age-distribution", async (req, res) => {
  try {
    const { annee_universitaire, structure_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (structure_id) {
      matchStage.$or = [
        { etablissement_id_paysage: structure_id },
        { etablissement_id_paysage_actuel: structure_id },
      ];
    }

    const ageDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$classe_age3",
            count: { $sum: "$effectif" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    let contextInfo = null;
    if (structure_id) {
      const structureInfo = await collection.findOne(
        {
          $or: [
            { etablissement_id_paysage: structure_id },
            { etablissement_id_paysage_actuel: structure_id },
          ],
        },
        {
          projection: {
            etablissement_lib: 1,
            etablissement_actuel_lib: 1,
          },
        }
      );

      if (structureInfo) {
        contextInfo = {
          id: structure_id,
          name:
            structureInfo.etablissement_actuel_lib ||
            structureInfo.etablissement_lib ||
            "Nom de l'université inconnu",
        };
      }
    }

    res.json({
      age_distribution: ageDistribution,
      context_info: contextInfo,
    });
  } catch (error) {
    console.error("Error fetching age distribution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/faculty-members/structures/establishment-type-distribution",
  async (req, res) => {
    try {
      const { annee_universitaire, structure_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (structure_id) {
        matchStage.$or = [
          { etablissement_id_paysage: structure_id },
          { etablissement_id_paysage_actuel: structure_id },
        ];
      }

      const establishmentTypeDistribution = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                establishment_type: "$etablissement_type",
                gender: "$sexe",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: "$_id.establishment_type",
              total_count: { $sum: "$count" },
              gender_breakdown: {
                $push: {
                  gender: "$_id.gender",
                  count: "$count",
                },
              },
            },
          },
          {
            $sort: {
              total_count: -1,
            },
          },
        ])
        .toArray();

      let contextInfo = null;
      if (structure_id) {
        const structureInfo = await collection.findOne(
          {
            $or: [
              { etablissement_id_paysage: structure_id },
              { etablissement_id_paysage_actuel: structure_id },
            ],
          },
          {
            projection: {
              etablissement_lib: 1,
              etablissement_actuel_lib: 1,
            },
          }
        );

        if (structureInfo) {
          contextInfo = {
            id: structure_id,
            name:
              structureInfo.etablissement_actuel_lib ||
              structureInfo.etablissement_lib ||
              "Nom de l'université inconnu",
          };
        }
      }

      res.json({
        establishment_type_distribution: establishmentTypeDistribution,
        context_info: contextInfo,
      });
    } catch (error) {
      console.error("Error fetching establishment type distribution:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/faculty-members/structures/discipline-distribution",
  async (req, res) => {
    try {
      const { annee_universitaire, structure_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (structure_id) {
        matchStage.$or = [
          { etablissement_id_paysage: structure_id },
          { etablissement_id_paysage_actuel: structure_id },
        ];
      }

      const disciplineDistribution = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                discipline_code: "$code_grande_discipline",
                discipline_name: "$grande_discipline",
                gender: "$sexe",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                discipline_code: "$_id.discipline_code",
                discipline_name: "$_id.discipline_name",
              },
              total_count: { $sum: "$count" },
              gender_breakdown: {
                $push: {
                  gender: "$_id.gender",
                  count: "$count",
                },
              },
            },
          },
          { $sort: { total_count: -1 } },
        ])
        .toArray();

      let contextInfo = null;
      if (structure_id) {
        const structureInfo = await collection.findOne(
          {
            $or: [
              { etablissement_id_paysage: structure_id },
              { etablissement_id_paysage_actuel: structure_id },
            ],
          },
          {
            projection: {
              etablissement_lib: 1,
              etablissement_actuel_lib: 1,
            },
          }
        );

        if (structureInfo) {
          contextInfo = {
            id: structure_id,
            name:
              structureInfo.etablissement_actuel_lib ||
              structureInfo.etablissement_lib ||
              "Nom de l'université inconnu",
          };
        }
      }

      res.json({
        discipline_distribution: disciplineDistribution,
        context_info: contextInfo,
      });
    } catch (error) {
      console.error("Error fetching discipline distribution:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/faculty-members/structures/status-distribution",
  async (req, res) => {
    try {
      const { annee_universitaire, structure_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (structure_id) {
        matchStage.$or = [
          { etablissement_id_paysage: structure_id },
          { etablissement_id_paysage_actuel: structure_id },
        ];
      }

      const statusDistribution = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                structure_code: "$etablissement_id_paysage_actuel",
                structure_name: "$etablissement_actuel_lib",
                status: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$is_enseignant_chercheur", true] },
                        then: "enseignant_chercheur",
                      },
                      {
                        case: {
                          $and: [
                            { $eq: ["$is_titulaire", true] },
                            { $eq: ["$is_enseignant_chercheur", false] },
                          ],
                        },
                        then: "titulaire_non_chercheur",
                      },
                      {
                        case: { $eq: ["$is_titulaire", false] },
                        then: "non_titulaire",
                      },
                    ],
                    default: "non_titulaire",
                  },
                },
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                structure_code: "$_id.structure_code",
                structure_name: "$_id.structure_name",
              },
              total_count: { $sum: "$count" },
              status_breakdown: {
                $push: {
                  status: "$_id.status",
                  count: "$count",
                },
              },
            },
          },
          { $sort: { total_count: -1 } },
        ])
        .toArray();

      let contextInfo = null;
      if (structure_id) {
        const structureInfo = await collection.findOne(
          {
            $or: [
              { etablissement_id_paysage: structure_id },
              { etablissement_id_paysage_actuel: structure_id },
            ],
          },
          {
            projection: {
              etablissement_lib: 1,
              etablissement_actuel_lib: 1,
            },
          }
        );

        if (structureInfo) {
          contextInfo = {
            id: structure_id,
            name:
              structureInfo.etablissement_actuel_lib ||
              structureInfo.etablissement_lib ||
              "Nom de l'université inconnu",
          };
        }
      }

      res.json({
        status_distribution: statusDistribution,
        context_info: contextInfo,
      });
    } catch (error) {
      console.error("Error fetching status distribution:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/faculty-members/structures/general-indicators",
  async (req, res) => {
    try {
      const { annee_universitaire, structure_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (structure_id) {
        matchStage.$or = [
          { etablissement_id_paysage: structure_id },
          { etablissement_id_paysage_actuel: structure_id },
        ];
      }

      // Distribution par genre
      const genderDistribution = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$sexe",
              count: { $sum: "$effectif" },
            },
          },
        ])
        .toArray();

      // Total des effectifs
      const totalCount = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: null,
              total: { $sum: "$effectif" },
            },
          },
        ])
        .toArray();

      // Informations contextuelles
      let contextInfo = null;
      if (structure_id) {
        const structureInfo = await collection.findOne(
          {
            $or: [
              { etablissement_id_paysage: structure_id },
              { etablissement_id_paysage_actuel: structure_id },
            ],
          },
          {
            projection: {
              etablissement_lib: 1,
              etablissement_actuel_lib: 1,
            },
          }
        );

        if (structureInfo) {
          contextInfo = {
            id: structure_id,
            name:
              structureInfo.etablissement_actuel_lib ||
              structureInfo.etablissement_lib ||
              "Nom de l'université inconnu",
          };
        }
      }

      res.json({
        gender_distribution: genderDistribution,
        total_count: totalCount[0]?.total || 0,
        context_info: contextInfo,
      });
    } catch (error) {
      console.error("Error fetching general indicators:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/faculty-members/structures/gender-distribution",
  async (req, res) => {
    try {
      const { annee_universitaire, structure_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (structure_id) {
        matchStage.$or = [
          { etablissement_id_paysage: structure_id },
          { etablissement_id_paysage_actuel: structure_id },
        ];
      }

      const genderDistribution = await collection
        .aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                structure_code: "$etablissement_id_paysage_actuel",
                structure_name: "$etablissement_actuel_lib",
                gender: "$sexe",
              },
              count: { $sum: "$effectif" },
            },
          },
          {
            $group: {
              _id: {
                structure_code: "$_id.structure_code",
                structure_name: "$_id.structure_name",
              },
              total_count: { $sum: "$count" },
              gender_breakdown: {
                $push: {
                  gender: "$_id.gender",
                  count: "$count",
                },
              },
            },
          },
          { $sort: { total_count: -1 } },
        ])
        .toArray();

      let contextInfo = null;
      if (structure_id) {
        const structureInfo = await collection.findOne(
          {
            $or: [
              { etablissement_id_paysage: structure_id },
              { etablissement_id_paysage_actuel: structure_id },
            ],
          },
          {
            projection: {
              etablissement_lib: 1,
              etablissement_actuel_lib: 1,
            },
          }
        );

        if (structureInfo) {
          contextInfo = {
            id: structure_id,
            name:
              structureInfo.etablissement_actuel_lib ||
              structureInfo.etablissement_lib ||
              "Nom de l'université inconnu",
          };
        }
      }

      res.json({
        gender_distribution: genderDistribution,
        context_info: contextInfo,
      });
    } catch (error) {
      console.error("Error fetching gender distribution:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/faculty-members/structures/top-indicators", async (req, res) => {
  try {
    const { annee_universitaire, structure_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (structure_id) {
      matchStage.$or = [
        { etablissement_id_paysage: structure_id },
        { etablissement_id_paysage_actuel: structure_id },
      ];
    }

    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              structure_code: "$etablissement_id_paysage_actuel",
              structure_name: "$etablissement_actuel_lib",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              structure_code: "$_id.structure_code",
              structure_name: "$_id.structure_name",
            },
            total_count: { $sum: "$count" },
            gender_breakdown: {
              $push: {
                gender: "$_id.gender",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    let contextInfo = null;
    if (structure_id) {
      const structureInfo = await collection.findOne(
        {
          $or: [
            { etablissement_id_paysage: structure_id },
            { etablissement_id_paysage_actuel: structure_id },
          ],
        },
        {
          projection: {
            etablissement_lib: 1,
            etablissement_actuel_lib: 1,
          },
        }
      );

      if (structureInfo) {
        contextInfo = {
          id: structure_id,
          name:
            structureInfo.etablissement_actuel_lib ||
            structureInfo.etablissement_lib ||
            "Nom de l'université inconnu",
        };
      }
    }

    res.json({
      gender_distribution: genderDistribution,
      context_info: contextInfo,
    });
  } catch (error) {
    console.error("Error fetching gender distribution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
