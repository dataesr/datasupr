import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-overview-geo-data", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-geo-by-region");

    const subjectsByRegionAndYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région", geo_nom: { $ne: null } } },
        { $unwind: "$subject" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              geo_id: "$geo_id",
              geo_nom: "$geo_nom",
              subject_label_fr: "$subject.label_fr",
            },
            totalHeadcount: { $sum: "$subject.headcount" },
            subject_id: { $first: "$subject.id" },
          },
        },
        {
          $group: {
            _id: {
              annee_universitaire: "$_id.annee_universitaire",
              geo_id: "$_id.geo_id",
              geo_nom: "$_id.geo_nom",
            },
            subjects: {
              $push: {
                id: "$subject_id",
                label_fr: "$_id.subject_label_fr",
                headcount: "$totalHeadcount",
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            regions_subjects: {
              $push: {
                geo_id: "$_id.geo_id",
                geo_nom: "$_id.geo_nom",
                subjects: "$subjects",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const subjectsByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $unwind: "$subject" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              subject_id: "$subject.id",
              subject_label_fr: "$subject.label_fr",
            },
            totalHeadcount: { $sum: "$subject.headcount" },
            totalFemaleCount: { $sum: "$subject.femaleCount" },
            totalMaleCount: { $sum: "$subject.maleCount" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            subjects: {
              $push: {
                id: "$_id.subject_id",
                label_fr: "$_id.subject_label_fr",
                headcount: "$totalHeadcount",
                femaleCount: "$totalFemaleCount",
                maleCount: "$totalMaleCount",
                femalePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: ["$totalFemaleCount", "$totalHeadcount"],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                malePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ["$totalMaleCount", "$totalHeadcount"] },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const professionalCategoriesByRegionAndYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région", geo_nom: { $ne: null } } },
        { $unwind: "$professional_category" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              geo_id: "$geo_id",
              geo_nom: "$geo_nom",
              professional_category_label_fr: "$professional_category.label_fr",
            },
            totalHeadcount: { $sum: "$professional_category.headcount" },
            professional_category_id: { $first: "$professional_category.id" },
          },
        },
        {
          $group: {
            _id: {
              annee_universitaire: "$_id.annee_universitaire",
              geo_id: "$_id.geo_id",
              geo_nom: "$_id.geo_nom",
            },
            professional_categories: {
              $push: {
                id: "$professional_category_id",
                label_fr: "$_id.professional_category_label_fr",
                headcount: "$totalHeadcount",
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            regions_professional_categories: {
              $push: {
                geo_id: "$_id.geo_id",
                geo_nom: "$_id.geo_nom",
                professional_categories: "$professional_categories",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const professionalCategoriesByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $unwind: "$professional_category" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              professional_category_id: "$professional_category.id",
              professional_category_label_fr: "$professional_category.label_fr",
            },
            totalHeadcount: { $sum: "$professional_category.headcount" },
            totalFemaleCount: { $sum: "$professional_category.femaleCount" },
            totalMaleCount: { $sum: "$professional_category.maleCount" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            professional_categories: {
              $push: {
                id: "$_id.professional_category_id",
                label_fr: "$_id.professional_category_label_fr",
                headcount: "$totalHeadcount",
                femaleCount: "$totalFemaleCount",
                maleCount: "$totalMaleCount",
                femalePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: ["$totalFemaleCount", "$totalHeadcount"],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                malePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ["$totalMaleCount", "$totalHeadcount"] },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const globalTotalsByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        {
          $group: {
            _id: "$annee_universitaire",
            totalHeadcountWoman: { $sum: "$headcountWoman" },
            totalHeadcountMan: { $sum: "$headcountMan" },
            totalHeadcountUnknown: { $sum: "$headcountUnknown" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const regionsByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région", geo_nom: { $ne: null } } },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              geo_id: "$geo_id",
              geo_nom: "$geo_nom",
            },
            headcountWoman: { $sum: "$headcountWoman" },
            headcountMan: { $sum: "$headcountMan" },
            headcountUnknown: { $sum: "$headcountUnknown" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            regions: {
              $push: {
                geo_id: "$_id.geo_id",
                geo_nom: "$_id.geo_nom",
                totalHeadcountWoman: "$headcountWoman",
                totalHeadcountMan: "$headcountMan",
                totalHeadcountUnknown: "$headcountUnknown",
                totalHeadcount: {
                  $sum: [
                    "$headcountWoman",
                    "$headcountMan",
                    "$headcountUnknown",
                  ],
                },
                femalePercent: {
                  $cond: [
                    {
                      $eq: [
                        {
                          $sum: [
                            "$headcountWoman",
                            "$headcountMan",
                            "$headcountUnknown",
                          ],
                        },
                        0,
                      ],
                    },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                "$headcountWoman",
                                {
                                  $sum: [
                                    "$headcountWoman",
                                    "$headcountMan",
                                    "$headcountUnknown",
                                  ],
                                },
                              ],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                malePercent: {
                  $cond: [
                    {
                      $eq: [
                        {
                          $sum: [
                            "$headcountWoman",
                            "$headcountMan",
                            "$headcountUnknown",
                          ],
                        },
                        0,
                      ],
                    },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                "$headcountMan",
                                {
                                  $sum: [
                                    "$headcountWoman",
                                    "$headcountMan",
                                    "$headcountUnknown",
                                  ],
                                },
                              ],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const ageDistributionByRegionAndYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région", geo_nom: { $ne: null } } },
        { $unwind: "$age_distribution" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              geo_id: "$geo_id",
              geo_nom: "$geo_nom",
              age_class: "$age_distribution.age_class",
            },
            headcount: { $sum: "$age_distribution.headcount" },
            femaleCount: { $sum: "$age_distribution.femaleCount" },
            maleCount: { $sum: "$age_distribution.maleCount" },
          },
        },
        {
          $group: {
            _id: {
              annee_universitaire: "$_id.annee_universitaire",
              geo_id: "$_id.geo_id",
              geo_nom: "$_id.geo_nom",
            },
            age_distribution: {
              $push: {
                age_class: "$_id.age_class",
                headcount: "$headcount",
                femaleCount: "$femaleCount",
                maleCount: "$maleCount",
                femalePercent: {
                  $cond: [
                    { $eq: ["$headcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ["$femaleCount", "$headcount"] },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                malePercent: {
                  $cond: [
                    { $eq: ["$headcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ["$maleCount", "$headcount"] },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            regions_age_distribution: {
              $push: {
                geo_id: "$_id.geo_id",
                geo_nom: "$_id.geo_nom",
                age_distribution: "$age_distribution",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const ageDistributionByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $unwind: "$age_distribution" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              age_class: "$age_distribution.age_class",
            },
            totalHeadcount: { $sum: "$age_distribution.headcount" },
            totalFemaleCount: { $sum: "$age_distribution.femaleCount" },
            totalMaleCount: { $sum: "$age_distribution.maleCount" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            age_distribution: {
              $push: {
                age_class: "$_id.age_class",
                headcount: "$totalHeadcount",
                femaleCount: "$totalFemaleCount",
                maleCount: "$totalMaleCount",
                femalePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: ["$totalFemaleCount", "$totalHeadcount"],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                malePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: ["$totalMaleCount", "$totalHeadcount"],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const quotiteByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $unwind: "$quotite_distribution" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              quotite_type: "$quotite_distribution.quotite_type",
            },
            totalHeadcount: { $sum: "$quotite_distribution.headcount" },
            totalFemaleCount: { $sum: "$quotite_distribution.femaleCount" },
            totalMaleCount: { $sum: "$quotite_distribution.maleCount" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            quotite_distribution: {
              $push: {
                quotite_type: "$_id.quotite_type",
                headcount: "$totalHeadcount",
                femaleCount: "$totalFemaleCount",
                maleCount: "$totalMaleCount",
                femalePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: ["$totalFemaleCount", "$totalHeadcount"],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                malePercent: {
                  $cond: [
                    { $eq: ["$totalHeadcount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: ["$totalMaleCount", "$totalHeadcount"],
                            },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const statusByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        {
          $group: {
            _id: "$annee_universitaire",
            enseignantChercheurCount: {
              $sum: "$enseignant_chercheur.headcount",
            },
            enseignantChercheurFemaleCount: {
              $sum: "$enseignant_chercheur.femaleCount",
            },
            enseignantChercheurMaleCount: {
              $sum: "$enseignant_chercheur.maleCount",
            },
            nonEnseignantChercheurCount: {
              $sum: "$non_enseignant_chercheur.headcount",
            },
            titulaireCount: { $sum: "$titulaire.headcount" },
            nonTitulaireCount: { $sum: "$non_titulaire.headcount" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const data = subjectsByYear.map((entry) => {
      const totals = globalTotalsByYear.find((e) => e._id === entry._id) || {};

      const categoriesData = professionalCategoriesByYear.find(
        (e) => e._id === entry._id
      );

      const regionData = regionsByYear.find((e) => e._id === entry._id);
      const ageData = ageDistributionByYear.find((e) => e._id === entry._id);
      const quotiteData = quotiteByYear.find((e) => e._id === entry._id);
      const statusData = statusByYear.find((e) => e._id === entry._id);
      const regionsAgeData = ageDistributionByRegionAndYear.find(
        (e) => e._id === entry._id
      );

      let enrichedRegions = regionData?.regions || [];

      if (
        regionsAgeData?.regions_age_distribution ||
        subjectsByRegionAndYear.find((e) => e._id === entry._id)
          ?.regions_subjects ||
        professionalCategoriesByRegionAndYear.find((e) => e._id === entry._id)
          ?.regions_professional_categories
      ) {
        enrichedRegions = enrichedRegions.map((region) => {
          const regionAgeData = regionsAgeData?.regions_age_distribution?.find(
            (r) => r.geo_id === region.geo_id
          );

          const regionSubjectsData = subjectsByRegionAndYear
            .find((e) => e._id === entry._id)
            ?.regions_subjects?.find((r) => r.geo_id === region.geo_id);

          const regionCategoriesData = professionalCategoriesByRegionAndYear
            .find((e) => e._id === entry._id)
            ?.regions_professional_categories?.find(
              (r) => r.geo_id === region.geo_id
            );

          return {
            ...region,
            age_distribution: regionAgeData?.age_distribution || [],
            subjects: regionSubjectsData?.subjects || [],
            professional_categories:
              regionCategoriesData?.professional_categories || [],
          };
        });
      }

      return {
        annee_universitaire: entry._id,
        subjects: entry.subjects || [],
        professional_categories: categoriesData?.professional_categories || [],
        totalHeadcountWoman: totals.totalHeadcountWoman || 0,
        totalHeadcountMan: totals.totalHeadcountMan || 0,
        totalHeadcountUnknown: totals.totalHeadcountUnknown || 0,
        regions: enrichedRegions,
        age_distribution: ageData?.age_distribution || [],
        quotite_distribution: quotiteData?.quotite_distribution || [],

        status: {
          enseignant_chercheur: {
            headcount: statusData?.enseignantChercheurCount || 0,
            femaleCount: statusData?.enseignantChercheurFemaleCount || 0,
            maleCount: statusData?.enseignantChercheurMaleCount || 0,
            femalePercent: statusData?.enseignantChercheurCount
              ? Math.round(
                  (statusData.enseignantChercheurFemaleCount /
                    statusData.enseignantChercheurCount) *
                    100
                )
              : 0,
            malePercent: statusData?.enseignantChercheurCount
              ? Math.round(
                  (statusData.enseignantChercheurMaleCount /
                    statusData.enseignantChercheurCount) *
                    100
                )
              : 0,
          },
          non_enseignant_chercheur: {
            headcount: statusData?.nonEnseignantChercheurCount || 0,
          },
          titulaire: {
            headcount: statusData?.titulaireCount || 0,
          },
          non_titulaire: {
            headcount: statusData?.nonTitulaireCount || 0,
          },
        },
      };
    });

    const years = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $group: { _id: "$annee_universitaire" } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, annee_universitaire: "$_id" } },
      ])
      .toArray();
    const yearsArray = years.map((year) => year.annee_universitaire);

    const geos = await collection
      .aggregate([
        {
          $match: {
            niveau_geo: { $in: ["Région", "Académie"] },
          },
        },
        {
          $group: {
            _id: {
              geo_id: "$geo_id",
              geo_nom: "$geo_nom",
              niveau_geo: "$niveau_geo",
            },
          },
        },
        {
          $project: {
            _id: 0,
            geo_id: "$_id.geo_id",
            geo_nom: "$_id.geo_nom",
            niveau_geo: "$_id.niveau_geo",
          },
        },
        { $sort: { niveau_geo: 1, geo_nom: 1 } },
      ])
      .toArray();

    res.json({
      data: data,
      years: yearsArray,
      geos: geos,
    });
  } catch (error) {
    console.error("Erreur API (geo-data):", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
