import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/regions", async (req, res) => {
  try {
    const collection = db.collection("faculty-members_main_staging");

    const regions = await collection
      .aggregate([
        {
          $group: {
            _id: {
              id: "$etablissement_code_region",
              lib: "$etablissement_region",
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
      regions: regions,
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({
      error: "Server error while fetching regions",
    });
  }
});

router.get("/faculty-members/geo/overview", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;
    if (geo_id) matchStage.etablissement_code_region = geo_id;

    // Le genre par region
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

    // La catégorie personnelle par region
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

    // L'âge par region
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

    // Le nombre d'enseignants titulaire par region
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

    let contextInfo = null;
    if (geo_id) {
      const regionInfo = await collection.findOne(
        { etablissement_code_region: geo_id },
        {
          projection: {
            etablissement_region: 1,
            etablissement_code_region: 1,
          },
        }
      );

      if (regionInfo) {
        contextInfo = {
          id: regionInfo.etablissement_code_region,
          name: regionInfo.etablissement_region,
          type: "region",
        };
      }
    }

    // Le nombre d'enseignants chercheur par region
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

    const regionStatusDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: "$etablissement_code_region",
              geo_name: "$etablissement_region",
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
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
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

    const regionGenderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: "$etablissement_code_region",
              geo_name: "$etablissement_region",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
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

    res.json({
      context_info: contextInfo,
      gender_distribution: genderDistribution,
      age_distribution: ageDistribution,
      establishmentTypeDistribution: establishmentTypeDistribution,
      regionGenderDistribution: regionGenderDistribution,
      regionStatusDistribution: regionStatusDistribution,
      discipline_distribution: discipline_distribution,
      permanentDistribution: permanentDistribution,
      quotiteDistribution: quotiteDistribution,
      personnalCategoryDistribution: personnalCategoryDistribution,
      researcherDistribution: researcherDistribution,
      total_count: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching geo overview:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/geo/cnu-analysis", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    let matchStage = {};
    if (annee_universitaire && annee_universitaire !== "all") {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
    }

    const cnuGroupsWithSections = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              // CORRECTION : Grouper d'abord par DISCIPLINE
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
      geo_id: geo_id || null,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données CNU geo:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des données CNU geo",
      error: error.message,
    });
  }
});

router.get("/faculty-members/geo/map-data", async (req, res) => {
  try {
    const { annee_universitaire } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire)
      matchStage.annee_universitaire = annee_universitaire;

    const mapData = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              region_code: "$etablissement_code_region",
              region_name: "$etablissement_region",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              region_code: "$_id.region_code",
              region_name: "$_id.region_name",
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
        {
          $match: {
            "_id.region_code": { $ne: null },
            "_id.region_name": { $ne: null },
          },
        },
        {
          $project: {
            _id: 0,
            geo_id: "$_id.region_code",
            geo_nom: "$_id.region_name",
            total_count: 1,
            gender_breakdown: 1,
            male_count: {
              $reduce: {
                input: "$gender_breakdown",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$this.gender", "Masculin"] },
                    { $add: ["$$value", "$$this.count"] },
                    "$$value",
                  ],
                },
              },
            },
            female_count: {
              $reduce: {
                input: "$gender_breakdown",
                initialValue: 0,
                in: {
                  $cond: [
                    { $eq: ["$$this.gender", "Féminin"] },
                    { $add: ["$$value", "$$this.count"] },
                    "$$value",
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            male_percent: {
              $cond: [
                { $gt: ["$total_count", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$male_count", "$total_count"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
                0,
              ],
            },
            female_percent: {
              $cond: [
                { $gt: ["$total_count", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$female_count", "$total_count"] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
                0,
              ],
            },
          },
        },
        { $sort: { total_count: -1 } },
      ])
      .toArray();

    const globalStats = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total_count: { $sum: "$effectif" },
            max_region_count: { $max: "$effectif" },
            min_region_count: { $min: "$effectif" },
          },
        },
      ])
      .toArray();

    const regionCounts = mapData
      .map((region) => region.total_count)
      .sort((a, b) => b - a);
    const stats = {
      total_count: globalStats[0]?.total_count || 0,
      max_region_count: Math.max(...regionCounts),
      min_region_count: Math.min(...regionCounts),
      p75: regionCounts[Math.floor(regionCounts.length * 0.25)] || 0,
      p50: regionCounts[Math.floor(regionCounts.length * 0.5)] || 0,
      p25: regionCounts[Math.floor(regionCounts.length * 0.75)] || 0,
      regions_count: regionCounts.length,
    };

    res.json({
      regions: mapData,
      statistics: stats,
      annee_universitaire: annee_universitaire || "Toutes les années",
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    res.status(500).json({
      error: "Server error while fetching map data",
      details: error.message,
    });
  }
});

router.get("/faculty-members/geo/evolution", async (req, res) => {
  try {
    const { geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const baseMatch = {};
    if (geo_id) baseMatch.etablissement_code_region = geo_id;

    const [years, allData, contextInfo] = await Promise.all([
      collection
        .distinct("annee_universitaire", baseMatch)
        .then((years) => years.filter((y) => y != null).sort()),

      collection
        .aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id: {
                annee_universitaire: "$annee_universitaire",
                region_code: geo_id ? null : "$etablissement_code_region",
                region_name: geo_id ? null : "$etablissement_region",
                discipline_code: "$code_grande_discipline",
                discipline_name: "$grande_discipline",
                gender: "$sexe",
                age_class: "$classe_age3",
                is_enseignant_chercheur: "$is_enseignant_chercheur",
                is_titulaire: "$is_titulaire",
              },
              count: { $sum: "$effectif" },
            },
          },
          { $sort: { "_id.annee_universitaire": 1 } },
        ])
        .toArray(),

      geo_id
        ? collection.findOne(
            { etablissement_code_region: geo_id },
            {
              projection: {
                etablissement_region: 1,
                etablissement_code_region: 1,
              },
            }
          )
        : Promise.resolve(null),
    ]);

    const globalEvolution = new Map();
    const statusEvolution = new Map();
    const ageEvolution = new Map();
    const regionEvolution = new Map();
    const disciplineEvolution = new Map();

    allData.forEach((item) => {
      const annee_universitaire = item._id.annee_universitaire;
      const count = item.count;

      if (!globalEvolution.has(annee_universitaire)) {
        globalEvolution.set(annee_universitaire, {
          annee_universitaire,
          total: 0,
          male: 0,
          female: 0,
        });
      }
      const global = globalEvolution.get(annee_universitaire);
      global.total += count;
      if (item._id.gender === "Masculin") global.male += count;
      if (item._id.gender === "Féminin") global.female += count;

      if (!statusEvolution.has(annee_universitaire)) {
        statusEvolution.set(annee_universitaire, {
          annee_universitaire,
          total: 0,
          enseignant_chercheur: 0,
          titulaire_non_chercheur: 0,
          non_titulaire: 0,
        });
      }
      const status = statusEvolution.get(annee_universitaire);
      status.total += count;
      if (item._id.is_enseignant_chercheur) {
        status.enseignant_chercheur += count;
      } else if (item._id.is_titulaire) {
        status.titulaire_non_chercheur += count;
      } else {
        status.non_titulaire += count;
      }

      // Age evolution
      const ageKey = `${annee_universitaire}-${item._id.age_class}`;
      if (!ageEvolution.has(annee_universitaire)) {
        ageEvolution.set(annee_universitaire, {
          annee_universitaire,
          total: 0,
          breakdown: new Map(),
        });
      }
      const age = ageEvolution.get(annee_universitaire);
      age.total += count;
      if (!age.breakdown.has(item._id.age_class)) {
        age.breakdown.set(item._id.age_class, 0);
      }
      age.breakdown.set(
        item._id.age_class,
        age.breakdown.get(item._id.age_class) + count
      );

      if (!geo_id && item._id.region_code) {
        const regionKey = `${annee_universitaire}-${item._id.region_code}`;
        if (!regionEvolution.has(regionKey)) {
          regionEvolution.set(regionKey, {
            _id: {
              annee_universitaire: annee_universitaire,
              region_code: item._id.region_code,
              region_name: item._id.region_name,
            },
            total_count: 0,
            male_count: 0,
            female_count: 0,
          });
        }
        const region = regionEvolution.get(regionKey);
        region.total_count += count;
        if (item._id.gender === "Masculin") region.male_count += count;
        if (item._id.gender === "Féminin") region.female_count += count;
      }

      if (item._id.discipline_code) {
        const discKey = `${annee_universitaire}-${item._id.discipline_code}`;
        if (!disciplineEvolution.has(discKey)) {
          disciplineEvolution.set(discKey, {
            _id: {
              annee_universitaire: annee_universitaire,
              discipline_code: item._id.discipline_code,
              discipline_name: item._id.discipline_name,
            },
            total_count: 0,
            male_count: 0,
            female_count: 0,
          });
        }
        const disc = disciplineEvolution.get(discKey);
        disc.total_count += count;
        if (item._id.gender === "Masculin") disc.male_count += count;
        if (item._id.gender === "Féminin") disc.female_count += count;
      }
    });

    const processedGlobalEvolution = Array.from(globalEvolution.values()).map(
      (item) => ({
        _id: item.annee_universitaire,
        total_count: item.total,
        gender_breakdown: [
          { gender: "Masculin", count: item.male },
          { gender: "Féminin", count: item.female },
        ].filter((g) => g.count > 0),
      })
    );

    const processedStatusEvolution = Array.from(statusEvolution.values()).map(
      (item) => ({
        _id: item.annee_universitaire,
        total_count: item.total,
        status_breakdown: [
          { status: "enseignant_chercheur", count: item.enseignant_chercheur },
          {
            status: "titulaire_non_chercheur",
            count: item.titulaire_non_chercheur,
          },
          { status: "non_titulaire", count: item.non_titulaire },
        ].filter((s) => s.count > 0),
      })
    );

    const processedAgeEvolution = Array.from(ageEvolution.values()).map(
      (item) => ({
        _id: item.annee_universitaire,
        total_count: item.total,
        age_breakdown: Array.from(item.breakdown.entries()).map(
          ([age, count]) => ({
            age_class: age,
            count: count,
          })
        ),
      })
    );

    let processedContextInfo = null;
    if (geo_id && contextInfo) {
      processedContextInfo = {
        id: contextInfo.etablissement_code_region,
        name: contextInfo.etablissement_region,
        type: "region",
      };
    }

    res.json({
      context_info: processedContextInfo,
      years: years,
      global_evolution: processedGlobalEvolution,
      status_evolution: processedStatusEvolution,
      age_evolution: processedAgeEvolution,
      region_evolution: Array.from(regionEvolution.values())
        .sort((a, b) => b.total_count - a.total_count)
        .slice(0, 100)
        .map((item) => ({
          _id: item._id,
          total_count: item.total_count,
          gender_breakdown: [
            { gender: "Masculin", count: item.male_count },
            { gender: "Féminin", count: item.female_count },
          ].filter((g) => g.count > 0),
        })),
      discipline_evolution: Array.from(disciplineEvolution.values())
        .sort((a, b) => b.total_count - a.total_count)
        .slice(0, 50)
        .map((item) => ({
          _id: item._id,
          total_count: item.total_count,
          gender_breakdown: [
            { gender: "Masculin", count: item.male_count },
            { gender: "Féminin", count: item.female_count },
          ].filter((g) => g.count > 0),
        })),
    });
  } catch (error) {
    console.error("Error fetching geo evolution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/geo/research-teachers", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {
      is_enseignant_chercheur: true,
    };
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
    }

    const ageClasses = [
      "35 ans et moins",
      "36 à 55 ans",
      "56 ans et plus",
      "Non précisé",
    ];

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
            maleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Masculin"] }, "$count", 0],
              },
            },
            femaleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Féminin"] }, "$count", 0],
              },
            },
            totalCount: { $sum: "$count" },
            ageDistribution: {
              $push: {
                ageClass: "$_id.age_class",
                count: "$count",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              group_code: "$_id.group_code",
              group_name: "$_id.group_name",
            },
            groupTotal: { $sum: "$totalCount" },
            maleCount: { $sum: "$maleCount" },
            femaleCount: { $sum: "$femaleCount" },
            sections: {
              $push: {
                sectionCode: "$_id.section_code",
                sectionName: "$_id.section_name",
                totalCount: "$totalCount",
                maleCount: "$maleCount",
                femaleCount: "$femaleCount",
                ageDistribution: "$ageDistribution",
              },
            },
          },
        },
        {
          $addFields: {
            ageDistribution: ageClasses.map((ageClass) => ({
              ageClass,
              count: {
                $sum: {
                  $map: {
                    input: "$sections",
                    as: "section",
                    in: {
                      $sum: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$$section.ageDistribution",
                              as: "age",
                              cond: { $eq: ["$$age.ageClass", ageClass] },
                            },
                          },
                          as: "filteredAge",
                          in: "$$filteredAge.count",
                        },
                      },
                    },
                  },
                },
              },
              percent: {
                $cond: {
                  if: { $gt: ["$groupTotal", 0] },
                  then: {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $sum: {
                              $map: {
                                input: "$sections",
                                as: "section",
                                in: {
                                  $sum: {
                                    $map: {
                                      input: {
                                        $filter: {
                                          input: "$$section.ageDistribution",
                                          as: "age",
                                          cond: {
                                            $eq: ["$$age.ageClass", ageClass],
                                          },
                                        },
                                      },
                                      as: "filteredAge",
                                      in: "$$filteredAge.count",
                                    },
                                  },
                                },
                              },
                            },
                          },
                          "$groupTotal",
                        ],
                      },
                      100,
                    ],
                  },
                  else: 0,
                },
              },
            })),
          },
        },
        { $sort: { groupTotal: -1 } },
      ])
      .toArray();

    const categoryDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              category_code: "$code_categorie_assimil",
              category_name: "$categorie_assimilation",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              category_code: "$_id.category_code",
              category_name: "$_id.category_name",
            },
            totalCount: { $sum: "$count" },
            maleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Masculin"] }, "$count", 0],
              },
            },
            femaleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Féminin"] }, "$count", 0],
              },
            },
          },
        },
        { $sort: { totalCount: -1 } },
      ])
      .toArray();

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

    const regionsData = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_id: "$etablissement_code_region",
              regionName: "$etablissement_region",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              geo_id: "$_id.geo_id",
              regionName: "$_id.regionName",
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

    const regions = regionsData
      .map((item) => {
        if (!item._id.geo_id || !item._id.regionName) return null;

        const maleCount =
          item.genderBreakdown.find((g) => g.gender === "Masculin")?.count || 0;
        const femaleCount =
          item.genderBreakdown.find((g) => g.gender === "Féminin")?.count || 0;

        return {
          geo_id: item._id.geo_id,
          regionName: item._id.regionName,
          maleCount: maleCount,
          femaleCount: femaleCount,
          totalCount: item.totalCount,
        };
      })
      .filter(Boolean);

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

    res.json({
      cnuGroups: cnuData.map((group) => ({
        cnuGroupId: group._id.group_code,
        cnuGroupLabel: group._id.group_name,
        maleCount: group.maleCount,
        femaleCount: group.femaleCount,
        totalCount: group.groupTotal,
        ageDistribution: group.ageDistribution,
        cnuSections: group.sections.map((section) => ({
          cnuSectionId: section.sectionCode,
          cnuSectionLabel: section.sectionName,
          maleCount: section.maleCount,
          femaleCount: section.femaleCount,
          totalCount: section.totalCount,
          ageDistribution: section.ageDistribution,
        })),
      })),
      regions: regions,
      categoryDistribution: categoryDistribution.map((cat) => ({
        categoryCode: cat._id.category_code,
        categoryName: cat._id.category_name,
        maleCount: cat.maleCount,
        femaleCount: cat.femaleCount,
        totalCount: cat.totalCount,
      })),
    });
  } catch (error) {
    console.error("Error fetching research teachers by geo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/faculty-members/geo/establishment-type-distribution",
  async (req, res) => {
    try {
      const { annee_universitaire, geo_id } = req.query;
      const collection = db.collection("faculty-members_main_staging");

      const matchStage = {};
      if (annee_universitaire) {
        matchStage.annee_universitaire = annee_universitaire;
      }
      if (geo_id) {
        matchStage.etablissement_code_region = geo_id;
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
          { $sort: { total_count: -1 } },
        ])
        .toArray();

      res.json({
        establishment_type_distribution: establishmentTypeDistribution,
      });
    } catch (error) {
      console.error(
        "Error fetching establishment type distribution for geo:",
        error
      );
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/faculty-members/geo/age-distribution", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
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

    res.json({
      age_distribution: ageDistribution,
    });
  } catch (error) {
    console.error("Error fetching age distribution for geo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/geo/discipline-distribution", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
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

    res.json({
      discipline_distribution: disciplineDistribution,
    });
  } catch (error) {
    console.error("Error fetching discipline distribution for geo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/geo/status-distribution", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
    }

    const statusDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: "$etablissement_code_region",
              geo_name: "$etablissement_region",
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
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
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

    res.json({
      status_distribution: statusDistribution,
    });
  } catch (error) {
    console.error("Error fetching status distribution for geo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/geo/general-indicators", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
    }

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
      total_count: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching general indicators for geo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/geo/gender-distribution", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
    }

    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: "$etablissement_code_region",
              geo_name: "$etablissement_region",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
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

    res.json({
      gender_distribution: genderDistribution,
    });
  } catch (error) {
    console.error("Error fetching gender distribution for geo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/faculty-members/geo/top-indicators", async (req, res) => {
  try {
    const { annee_universitaire, geo_id } = req.query;
    const collection = db.collection("faculty-members_main_staging");

    const matchStage = {};
    if (annee_universitaire) {
      matchStage.annee_universitaire = annee_universitaire;
    }
    if (geo_id) {
      matchStage.etablissement_code_region = geo_id;
    }

    const genderDistribution = await collection
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              geo_code: "$etablissement_code_region",
              geo_name: "$etablissement_region",
              gender: "$sexe",
            },
            count: { $sum: "$effectif" },
          },
        },
        {
          $group: {
            _id: {
              geo_code: "$_id.geo_code",
              geo_name: "$_id.geo_name",
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

    res.json({
      gender_distribution: genderDistribution,
    });
  } catch (error) {
    console.error("Error fetching top indicators for geo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
