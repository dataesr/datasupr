import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-overview-fields-data", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-fields");
    const { annee } = req.query;

    const pipeline = [];

    if (annee) {
      pipeline.push({ $match: { academic_year: annee } });
    }

    pipeline.push(
      { $unwind: "$headcount_per_fields" },
      {
        $unwind: {
          path: "$headcount_per_fields.headcount_per_cnu_group",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$headcount_per_fields.headcount_per_cnu_group.headcount_per_cnu_section",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            annee: "$academic_year",
            field_id: "$headcount_per_fields.field_id",
            field_label: "$headcount_per_fields.field_label",
            cnu_group_id:
              "$headcount_per_fields.headcount_per_cnu_group.cnu_group_id",
            cnu_group_label:
              "$headcount_per_fields.headcount_per_cnu_group.cnu_group_label",
            cnu_section_id:
              "$headcount_per_fields.headcount_per_cnu_group.headcount_per_cnu_section.cnu_section_id",
            cnu_section_label:
              "$headcount_per_fields.headcount_per_cnu_group.headcount_per_cnu_section.cnu_section_label",
          },
          hommes: {
            $sum: "$headcount_per_fields.headcount_per_cnu_group.headcount_per_cnu_section.numberMan",
          },
          femmes: {
            $sum: "$headcount_per_fields.headcount_per_cnu_group.headcount_per_cnu_section.numberWoman",
          },
          inconnus: {
            $sum: "$headcount_per_fields.headcount_per_cnu_group.headcount_per_cnu_section.numberUnknown",
          },
        },
      },
      {
        $group: {
          _id: {
            annee: "$_id.annee",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
            cnu_group_id: "$_id.cnu_group_id",
            cnu_group_label: "$_id.cnu_group_label",
          },
          hommes: { $sum: "$hommes" },
          femmes: { $sum: "$femmes" },
          inconnus: { $sum: "$inconnus" },
          cnu_sections: {
            $push: {
              cnu_section_id: "$_id.cnu_section_id",
              cnu_section_label: "$_id.cnu_section_label",
              hommes: "$hommes",
              femmes: "$femmes",
              inconnus: "$inconnus",
              total: { $sum: ["$hommes", "$femmes", "$inconnus"] },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            annee: "$_id.annee",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
          },
          hommes: { $sum: "$hommes" },
          femmes: { $sum: "$femmes" },
          inconnus: { $sum: "$inconnus" },
          cnu_groups: {
            $push: {
              cnu_group_id: "$_id.cnu_group_id",
              cnu_group_label: "$_id.cnu_group_label",
              hommes: "$hommes",
              femmes: "$femmes",
              inconnus: "$inconnus",
              total: { $sum: ["$hommes", "$femmes", "$inconnus"] },
              cnu_sections: "$cnu_sections",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.annee",
          fieldId: "$_id.field_id",
          fieldLabel: "$_id.field_label",
          maleCount: "$hommes",
          femaleCount: "$femmes",
          unknownCount: "$inconnus",
          totalCount: { $sum: ["$hommes", "$femmes", "$inconnus"] },
          cnuGroups: {
            $map: {
              input: "$cnu_groups",
              as: "group",
              in: {
                cnuGroupId: "$$group.cnu_group_id",
                cnuGroupLabel: "$$group.cnu_group_label",
                maleCount: "$$group.hommes",
                femaleCount: "$$group.femmes",
                unknownCount: "$$group.inconnus",
                totalCount: "$$group.total",
                cnuSections: {
                  $map: {
                    input: "$$group.cnu_sections",
                    as: "section",
                    in: {
                      cnuSectionId: "$$section.cnu_section_id",
                      cnuSectionLabel: "$$section.cnu_section_label",
                      maleCount: "$$section.hommes",
                      femaleCount: "$$section.femmes",
                      unknownCount: "$$section.inconnus",
                      totalCount: "$$section.total",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $sort: { annee: -1, field_label: 1 },
      }
    );

    const result = await collection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("Erreur dans /faculty-members-overview-fields-data:", err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  }
});

export default router;
