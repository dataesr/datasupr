import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/fields", async (req, res) => {
  try {
    const collection = db.collection("faculty-members_main_staging");

    const fields = await collection
      .aggregate([
        {
          $group: {
            _id: {
              id: "$code_grande_discipline",
              lib: "$grande_discipline",
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
      fields: fields,
    });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({
      error: "Server error while fetching fields",
    });
  }
});

router.get("/faculty-members/fields/overview", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;
    if (field_id) matchStage.code_grande_discipline = field_id;

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

    let contextInfo = null;
    if (field_id) {
      const disciplineInfo = await collection.findOne(
        { code_grande_discipline: field_id },
        { projection: { grande_discipline: 1, code_grande_discipline: 1 } }
      );

      if (disciplineInfo) {
        contextInfo = {
          id: disciplineInfo.code_grande_discipline,
          name: disciplineInfo.grande_discipline,
          type: "discipline",
        };
      }
    }

    const disciplineGenderDistribution = await collection
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

    const disciplineStatusDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $addFields: {
            status_category: {
              $cond: {
                if: { $eq: ["$is_enseignant_chercheur", true] },
                then: "enseignant_chercheur",
                else: {
                  $cond: {
                    if: { $eq: ["$is_titulaire", true] },
                    then: "titulaire_non_chercheur",
                    else: "non_titulaire",
                  },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$code_grande_discipline",
              discipline_name: "$grande_discipline",
              status_category: "$status_category",
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
            status_breakdown: {
              $push: {
                status: "$_id.status_category",
                count: "$count",
              },
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

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

    res.json({
      context_info: contextInfo,
      gender_distribution: genderDistribution,
      age_distribution: ageDistribution,
      establishmentTypeDistribution: establishmentTypeDistribution,
      discipline_distribution: discipline_distribution,
      permanentDistribution: permanentDistribution,
      personnalCategoryDistribution: personnalCategoryDistribution,
      disciplineGenderDistribution: disciplineGenderDistribution,
      quotiteDistribution: quotiteDistribution,
      researcherDistribution: researcherDistribution,
      disciplineStatusDistribution: disciplineStatusDistribution,
      total_count: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching fields overview:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/cnu-analysis", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;
    if (field_id) matchStage.code_grande_discipline = field_id;

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
            section_total: { $sum: "$count" },
            section_details: {
              $push: {
                gender: "$_id.gender",
                age_range: "$_id.age_range",
                count: "$count",
              },
            },
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
            group_total: { $sum: "$section_total" },
            sections: {
              $push: {
                section_code: "$_id.section_code",
                section_name: "$_id.section_name",
                section_total: "$section_total",
                details: "$section_details",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              discipline_code: "$_id.discipline_code",
              discipline_name: "$_id.discipline_name",
            },
            discipline_total: { $sum: "$group_total" },
            groups: {
              $push: {
                group_code: "$_id.group_code",
                group_name: "$_id.group_name",
                group_total: "$group_total",
                sections: "$sections",
              },
            },
          },
        },
        { $sort: { discipline_total: -1 } },
      ])
      .toArray();

    const genderByGroups = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              discipline_code: "$code_grande_discipline", // AJOUT
              discipline_name: "$grande_discipline", // AJOUT
              group_code: "$code_groupe_cnu",
              group_name: "$groupe_cnu",
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
            },
            details: {
              $push: {
                gender: "$_id.gender",
                age_range: "$_id.age_range",
                count: "$count",
              },
            },
            total: { $sum: "$count" },
          },
        },
        { $sort: { total: -1 } },
      ])
      .toArray();

    res.json({
      cnu_groups_with_sections: cnuGroupsWithSections,
      gender_summary_by_CNU_groups: genderByGroups,
    });
  } catch (error) {
    console.error("Error fetching CNU analysis:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/evolution", async (req, res) => {
  try {
    const { field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (field_id) matchStage.code_grande_discipline = field_id;

    const [
      years,
      globalEvolution,
      statusEvolution,
      ageEvolution,
      disciplineEvolution,
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

      !field_id
        ? collection
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
              { $limit: 100 },
            ])
            .toArray()
        : Promise.resolve([]),

      field_id
        ? collection.findOne(
            { code_grande_discipline: field_id },
            { projection: { grande_discipline: 1, code_grande_discipline: 1 } }
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

    let processedContextInfo = null;
    if (field_id && contextInfo) {
      processedContextInfo = {
        id: contextInfo.code_grande_discipline,
        name: contextInfo.grande_discipline,
        type: "discipline",
      };
    }

    res.json({
      context_info: processedContextInfo,
      years: years,
      global_evolution: processedGlobalEvolution,
      status_evolution: processedStatusEvolution,
      age_evolution: ageEvolution,
      discipline_evolution: processedDisciplineEvolution,
    });
  } catch (error) {
    console.error("Error fetching fields evolution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/fields/research-teachers", async (req, res) => {
  try {
    const { annee_universitaire, field_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {
      is_enseignant_chercheur: true,
    };
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;
    if (field_id) matchStage.code_grande_discipline = field_id;

    if (field_id) {
      const disciplineInfo = await collection.findOne(
        { code_grande_discipline: field_id },
        { projection: { grande_discipline: 1, code_grande_discipline: 1 } }
      );

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

      const totalCount = genderData.reduce((sum, item) => sum + item.count, 0);
      const maleCount =
        genderData.find((item) => item._id === "Masculin")?.count || 0;
      const femaleCount =
        genderData.find((item) => item._id === "Féminin")?.count || 0;

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
          item.genderBreakdown.find((g) => g.gender === "Masculin")?.count || 0;
        const femaleCount =
          item.genderBreakdown.find((g) => g.gender === "Féminin")?.count || 0;

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

      const result = {
        field_id: field_id,
        fieldLabel: disciplineInfo?.grande_discipline || "Discipline inconnue",
        maleCount: maleCount,
        femaleCount: femaleCount,
        totalCount: totalCount,
        ageDistribution: ageDistribution.map((item) => ({
          ageClass: item._id,
          count: item.count,
          percent:
            totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : "0",
        })),
        cnuGroups: Array.from(cnuGroups.values()),
      };

      res.json(result);
    } else {
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
          item.genderBreakdown.find((g) => g.gender === "Masculin")?.count || 0;
        const femaleCount =
          item.genderBreakdown.find((g) => g.gender === "Féminin")?.count || 0;

        return {
          field_id: item._id.field_id,
          fieldLabel: item._id.fieldLabel,
          maleCount: maleCount,
          femaleCount: femaleCount,
          totalCount: item.totalCount,
        };
      });

      const totalCount = fields.reduce(
        (sum, field) => sum + field.totalCount,
        0
      );
      const maleCount = fields.reduce((sum, field) => sum + field.maleCount, 0);
      const femaleCount = fields.reduce(
        (sum, field) => sum + field.femaleCount,
        0
      );

      res.json({
        totalCount: totalCount,
        maleCount: maleCount,
        femaleCount: femaleCount,
        fields: fields,
      });
    }
  } catch (error) {
    console.error("Error fetching research teachers by fields:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
