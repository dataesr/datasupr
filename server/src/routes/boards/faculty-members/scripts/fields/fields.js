import { MongoClient } from "mongodb";

async function transformAndInsert() {
  const client = new MongoClient("mongodb://localhost:27017/");

  try {
    await client.connect();
    const db = client.db("datasupr");
    const source = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );
    const targetCollectionName = "teaching-staff-fields";

    const pipeline = [
      {
        $group: {
          _id: {
            geo_id: "$etablissement_id_paysage",
            geo_level: "etablissement",
            geo_name: "$etablissement_actuel_lib",
            academic_year: "$annee_universitaire",
            field_id: "$code_grande_discipline",
            field_label: "$grande_discipline",
            cnu_group_id: "$code_groupe_cnu",
            cnu_group_label: "$groupe_cnu",
            cnu_section_id: "$code_section_cnu",
            cnu_section_label: "$section_cnu",
            sexe: "$sexe",
          },
          total: { $sum: "$effectif" },
        },
      },
      {
        $group: {
          _id: {
            geo_id: "$_id.geo_id",
            geo_level: "$_id.geo_level",
            geo_name: "$_id.geo_name",
            academic_year: "$_id.academic_year",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
            cnu_group_id: "$_id.cnu_group_id",
            cnu_group_label: "$_id.cnu_group_label",
            cnu_section_id: "$_id.cnu_section_id",
            cnu_section_label: "$_id.cnu_section_label",
          },
          numberWoman: {
            $sum: {
              $cond: [{ $eq: ["$_id.sexe", "Féminin"] }, "$total", 0],
            },
          },
          numberMan: {
            $sum: {
              $cond: [{ $eq: ["$_id.sexe", "Masculin"] }, "$total", 0],
            },
          },
          numberUnknown: {
            $sum: {
              $cond: [
                { $not: { $in: ["$_id.sexe", ["Féminin", "Masculin"]] } },
                "$total",
                0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            geo_id: "$_id.geo_id",
            geo_level: "$_id.geo_level",
            geo_name: "$_id.geo_name",
            academic_year: "$_id.academic_year",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
            cnu_group_id: "$_id.cnu_group_id",
            cnu_group_label: "$_id.cnu_group_label",
          },
          headcount_per_cnu_section: {
            $push: {
              cnu_section_id: "$_id.cnu_section_id",
              cnu_section_label: "$_id.cnu_section_label",
              numberWoman: "$numberWoman",
              numberMan: "$numberMan",
              numberUnknown: "$numberUnknown",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            geo_id: "$_id.geo_id",
            geo_level: "$_id.geo_level",
            geo_name: "$_id.geo_name",
            academic_year: "$_id.academic_year",
            field_id: "$_id.field_id",
            field_label: "$_id.field_label",
          },
          headcount_per_cnu_group: {
            $push: {
              cnu_group_id: "$_id.cnu_group_id",
              cnu_group_label: "$_id.cnu_group_label",
              headcount_per_cnu_section: "$headcount_per_cnu_section",
              numberWoman: {
                $sum: {
                  $sum: "$headcount_per_cnu_section.numberWoman",
                },
              },
              numberMan: {
                $sum: {
                  $sum: "$headcount_per_cnu_section.numberMan",
                },
              },
              numberUnknown: {
                $sum: {
                  $sum: "$headcount_per_cnu_section.numberUnknown",
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            geo_id: "$_id.geo_id",
            geo_level: "$_id.geo_level",
            geo_name: "$_id.geo_name",
            academic_year: "$_id.academic_year",
          },
          headcount_per_fields: {
            $push: {
              field_id: "$_id.field_id",
              field_label: "$_id.field_label",
              headcount_per_cnu_group: "$headcount_per_cnu_group",
              numberWoman: {
                $sum: {
                  $sum: "$headcount_per_cnu_group.numberWoman",
                },
              },
              numberMan: {
                $sum: {
                  $sum: "$headcount_per_cnu_group.numberMan",
                },
              },
              numberUnknown: {
                $sum: {
                  $sum: "$headcount_per_cnu_group.numberUnknown",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: false,
          geo_id: "$_id.geo_id",
          geo_level: "$_id.geo_level",
          geo_name: "$_id.geo_name",
          academic_year: "$_id.academic_year",
          headcount_per_fields: 1,
        },
      },
      {
        $merge: {
          into: targetCollectionName,
          whenMatched: "merge",
          whenNotMatched: "insert",
        },
      },
    ];

    await source.aggregate(pipeline).toArray();

    console.log("Transformation et insertion terminées !");
  } finally {
    await client.close();
  }
}

transformAndInsert().catch(console.dir);
