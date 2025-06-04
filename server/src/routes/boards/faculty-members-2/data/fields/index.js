import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/fields", async (req, res) => {
  try {
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

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
    const { year, field_id } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const matchStage = {};
    if (year) matchStage.annee_universitaire = year;
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

    res.json({
      context_info: contextInfo,
      gender_distribution: genderDistribution,
      age_distribution: ageDistribution,
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
    const { year, field_id } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const matchStage = {};
    if (year) matchStage.annee_universitaire = year;
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
              discipline_code: "$_id.discipline_code", // AJOUT
              discipline_name: "$_id.discipline_name", // AJOUT
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

export default router;
