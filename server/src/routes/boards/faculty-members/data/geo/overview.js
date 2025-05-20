import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-overview-geo-data", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-general-indicators");

    const subjectsByYear = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $unwind: "$subject" },
        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              subject_label_fr: "$subject.label_fr",
            },
            totalHeadcount: { $sum: "$subject.headcount" },
            subject_id: { $first: "$subject.id" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            subjects: {
              $push: {
                id: "$subject_id",
                label_fr: "$_id.subject_label_fr",
                headcount: "$totalHeadcount",
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
              professional_category_label_fr: "$professional_category.label_fr",
            },
            totalHeadcount: { $sum: "$professional_category.headcount" },
            professional_category_id: { $first: "$professional_category.id" },
          },
        },
        {
          $group: {
            _id: "$_id.annee_universitaire",
            professional_categories: {
              $push: {
                id: "$professional_category_id",
                label_fr: "$_id.professional_category_label_fr",
                headcount: "$totalHeadcount",
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

    const data = subjectsByYear.map((entry) => {
      const totals = globalTotalsByYear.find((e) => e._id === entry._id) || {};
      const categories = professionalCategoriesByYear.find(
        (e) => e._id === entry._id
      );
      const regionData = regionsByYear.find((e) => e._id === entry._id);

      return {
        annee_universitaire: entry._id,
        subjects: entry.subjects,
        professional_categories: categories?.professional_categories || [],
        totalHeadcountWoman: totals.totalHeadcountWoman || 0,
        totalHeadcountMan: totals.totalHeadcountMan || 0,
        totalHeadcountUnknown: totals.totalHeadcountUnknown || 0,
        regions: regionData?.regions || [],
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

router.get("/faculty-members-overview-geo-data/:geoId", async (req, res) => {
  try {
    const { geoId } = req.params;
    const collection = db.collection("teaching-staff-general-indicators");

    const data = await collection
      .aggregate([
        { $match: { geo_id: geoId } },

        { $unwind: "$subject" },
        { $unwind: "$professional_category" },

        {
          $group: {
            _id: {
              annee_universitaire: "$annee_universitaire",
              subject_label_fr: "$subject.label_fr",
              professional_category_label_fr: "$professional_category.label_fr",
            },
            subject_headcount: { $sum: "$subject.headcount" },
            subject_id: { $first: "$subject.id" },
            professional_category_headcount: {
              $sum: "$professional_category.headcount",
            },
            professional_category_id: { $first: "$professional_category.id" },
            totalHeadcountWoman: { $first: "$headcountWoman" },
            totalHeadcountMan: { $first: "$headcountMan" },
            totalHeadcountUnknown: { $first: "$headcountUnknown" },
          },
        },

        {
          $group: {
            _id: "$_id.annee_universitaire",

            subjects: {
              $addToSet: {
                id: "$subject_id",
                label_fr: "$_id.subject_label_fr",
                headcount: "$subject_headcount",
              },
            },
            professional_categories: {
              $addToSet: {
                id: "$professional_category_id",
                label_fr: "$_id.professional_category_label_fr",
                headcount: "$professional_category_headcount",
              },
            },
            totalHeadcountWoman: { $sum: "$totalHeadcountWoman" },
            totalHeadcountMan: { $sum: "$totalHeadcountMan" },
            totalHeadcountUnknown: { $sum: "$totalHeadcountUnknown" },
          },
        },

        {
          $project: {
            _id: 0,
            annee_universitaire: "$_id",
            subjects: 1,
            professional_categories: 1,
            totalHeadcountWoman: 1,
            totalHeadcountMan: 1,
            totalHeadcountUnknown: 1,
          },
        },
        { $sort: { annee_universitaire: 1 } },
      ])
      .toArray();

    res.json(data);
  } catch (error) {
    console.error("Erreur API (geo-data/:geoId):", error);
    res.status(500).json({ message: error.message });
  }
});
export default router;
