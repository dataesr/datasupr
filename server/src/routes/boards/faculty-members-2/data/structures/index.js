import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/structures", async (req, res) => {
  try {
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

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
    const { year, structure_id } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const matchStage = {};
    if (year) matchStage.annee_universitaire = year;
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
          id: structureInfo.etablissement_id_paysage_actuel,
          name:
            structureInfo.etablissement_actuel_lib ||
            structureInfo.etablissement_lib,
          type: "structure",
          structure_type: structureInfo.etablissement_type,
          region: structureInfo.etablissement_region,
        };
      }
    }

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
    const { year, structure_id } = req.query;
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    let matchStage = {};
    if (year && year !== "all") {
      matchStage.annee_universitaire = year;
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

    console.log(
      "Structures CNU Data:",
      cnuGroupsWithSections.length,
      "disciplines found"
    );

    res.json({
      cnu_groups_with_sections: cnuGroupsWithSections,
      year: year || "current",
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

export default router;
