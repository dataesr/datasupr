import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");

async function run() {
  try {
    const database = client.db("datasupr");
    const personnelEnseignantCollection = database.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );
    const calculsCollection = database.collection(
      "teaching-staff-geo-by-region"
    );

    await calculsCollection.deleteMany({});

    const years = await personnelEnseignantCollection.distinct("rentree");
    const geoIds = await personnelEnseignantCollection.distinct(
      "etablissement_code_region"
    );
    const acaIds = await personnelEnseignantCollection.distinct(
      "etablissement_code_academie"
    );
    const disciplineIds = await personnelEnseignantCollection.distinct(
      "code_grande_discipline"
    );
    const assimilationIds = await personnelEnseignantCollection.distinct(
      "code_categorie_assimil"
    );
    const ageClasses = await personnelEnseignantCollection.distinct(
      "classe_age3"
    );
    const quotiteTypes = await personnelEnseignantCollection.distinct(
      "quotite"
    );

    for (let i = 0; i < years.length; i++) {
      for (let j = 0; j < geoIds.length; j++) {
        const query = {
          etablissement_code_region: geoIds[j],
          rentree: years[i],
        };
        const data = await personnelEnseignantCollection.find(query).toArray();

        if (data.length === 0) continue;

        const effectifSexeF = data
          .filter((item) => item.sexe === "Féminin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeM = data
          .filter((item) => item.sexe === "Masculin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeNR = data
          .filter((item) => item.sexe === "Non renseigné")
          .reduce((acc, item) => acc + item.effectif, 0);

        const ageDistribution = [];
        for (let k = 0; k < ageClasses.length; k++) {
          const ageData = data.filter(
            (item) => item.classe_age3 === ageClasses[k]
          );
          const total = ageData.reduce((acc, item) => acc + item.effectif, 0);
          const femaleCount = ageData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = ageData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          if (total > 0) {
            ageDistribution.push({
              age_class: ageClasses[k],
              headcount: total,
              femaleCount: femaleCount,
              maleCount: maleCount,
              femalePercent: Math.round((femaleCount / total) * 100),
              malePercent: Math.round((maleCount / total) * 100),
            });
          }
        }

        const quotiteDistribution = [];
        for (let k = 0; k < quotiteTypes.length; k++) {
          const quotiteData = data.filter(
            (item) => item.quotite === quotiteTypes[k]
          );
          const total = quotiteData.reduce(
            (acc, item) => acc + item.effectif,
            0
          );
          const femaleCount = quotiteData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = quotiteData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          if (total > 0) {
            quotiteDistribution.push({
              quotite_type: quotiteTypes[k],
              headcount: total,
              femaleCount: femaleCount,
              maleCount: maleCount,
              femalePercent: Math.round((femaleCount / total) * 100),
              malePercent: Math.round((maleCount / total) * 100),
            });
          }
        }

        const enseignantChercheurCount = data
          .filter((item) => item.is_enseignant_chercheur === true)
          .reduce((acc, item) => acc + item.effectif, 0);
        const nonEnseignantChercheurCount = data
          .filter(
            (item) =>
              item.is_enseignant_chercheur === false ||
              item.is_enseignant_chercheur === undefined
          )
          .reduce((acc, item) => acc + item.effectif, 0);

        const ecFemaleCount = data
          .filter(
            (item) =>
              item.is_enseignant_chercheur === true && item.sexe === "Féminin"
          )
          .reduce((acc, item) => acc + item.effectif, 0);
        const ecMaleCount = data
          .filter(
            (item) =>
              item.is_enseignant_chercheur === true && item.sexe === "Masculin"
          )
          .reduce((acc, item) => acc + item.effectif, 0);

        const titulaireCount = data
          .filter((item) => item.is_titulaire === true)
          .reduce((acc, item) => acc + item.effectif, 0);
        const nonTitulaireCount = data
          .filter(
            (item) =>
              item.is_titulaire === false || item.is_titulaire === undefined
          )
          .reduce((acc, item) => acc + item.effectif, 0);

        let subDisciplineIds = new Set();
        data.forEach((item) => {
          subDisciplineIds.add(item.code_grande_discipline);
        });
        subDisciplineIds = [...subDisciplineIds];

        var headcount_per_subject = new Array();

        for (let k = 0; k < subDisciplineIds.length; k++) {
          const subData = data.filter(
            (item) => item.code_grande_discipline === subDisciplineIds[k]
          );

          let subject = new Array();
          subData.forEach((item) => {
            subject.push(item.grande_discipline);
          });

          const label_fr = subject.find((element) => element != undefined);

          const total = subData.reduce((acc, item) => acc + item.effectif, 0);
          const femaleCount = subData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = subData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          const disciplineCount = {
            id: subDisciplineIds[k],
            label_fr: label_fr,
            headcount: total,
            femaleCount: femaleCount,
            maleCount: maleCount,
            femalePercent:
              total > 0 ? Math.round((femaleCount / total) * 100) : 0,
            malePercent: total > 0 ? Math.round((maleCount / total) * 100) : 0,
          };

          headcount_per_subject.push(disciplineCount);
        }

        let subAssimilationIds = new Set();
        data.forEach((item) => {
          subAssimilationIds.add(item.code_categorie_assimil);
        });
        subAssimilationIds = [...subAssimilationIds];

        var headcount_per_professional_category = new Array();

        for (let k = 0; k < subAssimilationIds.length; k++) {
          const subData = data.filter(
            (item) => item.code_categorie_assimil === subAssimilationIds[k]
          );

          let assimilation = new Array();
          subData.forEach((item) => {
            assimilation.push(item.categorie_assimilation);
          });

          const label_fr = assimilation.find((element) => element != undefined);

          const total = subData.reduce((acc, item) => acc + item.effectif, 0);
          const femaleCount = subData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = subData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          const ageDistPerCategory = [];
          for (let l = 0; l < ageClasses.length; l++) {
            const ageData = subData.filter(
              (item) => item.classe_age3 === ageClasses[l]
            );
            const ageTotal = ageData.reduce(
              (acc, item) => acc + item.effectif,
              0
            );

            if (ageTotal > 0) {
              ageDistPerCategory.push({
                age_class: ageClasses[l],
                headcount: ageTotal,
              });
            }
          }

          const catProCount = {
            id: subAssimilationIds[k],
            label_fr: label_fr,
            headcount: total,
            femaleCount: femaleCount,
            maleCount: maleCount,
            femalePercent:
              total > 0 ? Math.round((femaleCount / total) * 100) : 0,
            malePercent: total > 0 ? Math.round((maleCount / total) * 100) : 0,
            age_distribution: ageDistPerCategory,
          };

          headcount_per_professional_category.push(catProCount);
        }

        const calculElement = {
          geo_id: geoIds[j],
          niveau_geo: "Région",
          geo_nom: data[0]?.etablissement_region,
          annee_universitaire: years[i],
          headcountWoman: effectifSexeF,
          headcountMan: effectifSexeM,
          headcountUnknown: effectifSexeNR,
          subject: headcount_per_subject,
          professional_category: headcount_per_professional_category,
          age_distribution: ageDistribution,
          quotite_distribution: quotiteDistribution,
          enseignant_chercheur: {
            headcount: enseignantChercheurCount,
            femaleCount: ecFemaleCount,
            maleCount: ecMaleCount,
            femalePercent:
              enseignantChercheurCount > 0
                ? Math.round((ecFemaleCount / enseignantChercheurCount) * 100)
                : 0,
            malePercent:
              enseignantChercheurCount > 0
                ? Math.round((ecMaleCount / enseignantChercheurCount) * 100)
                : 0,
          },
          non_enseignant_chercheur: {
            headcount: nonEnseignantChercheurCount,
          },
          titulaire: {
            headcount: titulaireCount,
          },
          non_titulaire: {
            headcount: nonTitulaireCount,
          },
        };

        const result = await calculsCollection.insertOne(calculElement);
      }
    }

    for (let i = 0; i < years.length; i++) {
      for (let j = 0; j < acaIds.length; j++) {
        const query = {
          etablissement_code_academie: acaIds[j],
          rentree: years[i],
        };
        const data = await personnelEnseignantCollection.find(query).toArray();

        if (data.length === 0) continue;

        const effectifSexeF = data
          .filter((item) => item.sexe === "Féminin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeM = data
          .filter((item) => item.sexe === "Masculin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeNR = data
          .filter((item) => item.sexe === "Non renseigné")
          .reduce((acc, item) => acc + item.effectif, 0);

        const ageDistribution = [];
        for (let k = 0; k < ageClasses.length; k++) {
          const ageData = data.filter(
            (item) => item.classe_age3 === ageClasses[k]
          );
          const total = ageData.reduce((acc, item) => acc + item.effectif, 0);
          const femaleCount = ageData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = ageData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          if (total > 0) {
            ageDistribution.push({
              age_class: ageClasses[k],
              headcount: total,
              femaleCount: femaleCount,
              maleCount: maleCount,
              femalePercent: Math.round((femaleCount / total) * 100),
              malePercent: Math.round((maleCount / total) * 100),
            });
          }
        }

        const quotiteDistribution = [];
        for (let k = 0; k < quotiteTypes.length; k++) {
          const quotiteData = data.filter(
            (item) => item.quotite === quotiteTypes[k]
          );
          const total = quotiteData.reduce(
            (acc, item) => acc + item.effectif,
            0
          );
          const femaleCount = quotiteData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = quotiteData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          if (total > 0) {
            quotiteDistribution.push({
              quotite_type: quotiteTypes[k],
              headcount: total,
              femaleCount: femaleCount,
              maleCount: maleCount,
              femalePercent: Math.round((femaleCount / total) * 100),
              malePercent: Math.round((maleCount / total) * 100),
            });
          }
        }

        const enseignantChercheurCount = data
          .filter((item) => item.is_enseignant_chercheur === true)
          .reduce((acc, item) => acc + item.effectif, 0);
        const nonEnseignantChercheurCount = data
          .filter(
            (item) =>
              item.is_enseignant_chercheur === false ||
              item.is_enseignant_chercheur === undefined
          )
          .reduce((acc, item) => acc + item.effectif, 0);

        const ecFemaleCount = data
          .filter(
            (item) =>
              item.is_enseignant_chercheur === true && item.sexe === "Féminin"
          )
          .reduce((acc, item) => acc + item.effectif, 0);
        const ecMaleCount = data
          .filter(
            (item) =>
              item.is_enseignant_chercheur === true && item.sexe === "Masculin"
          )
          .reduce((acc, item) => acc + item.effectif, 0);

        const titulaireCount = data
          .filter((item) => item.is_titulaire === true)
          .reduce((acc, item) => acc + item.effectif, 0);
        const nonTitulaireCount = data
          .filter(
            (item) =>
              item.is_titulaire === false || item.is_titulaire === undefined
          )
          .reduce((acc, item) => acc + item.effectif, 0);

        let subDisciplineIds = new Set();
        data.forEach((item) => {
          subDisciplineIds.add(item.code_grande_discipline);
        });
        subDisciplineIds = [...subDisciplineIds];

        var headcount_per_subject = new Array();

        for (let k = 0; k < subDisciplineIds.length; k++) {
          const subData = data.filter(
            (item) => item.code_grande_discipline === subDisciplineIds[k]
          );

          let subject = new Array();
          subData.forEach((item) => {
            subject.push(item.grande_discipline);
          });

          const label_fr = subject.find((element) => element != undefined);
          const total = subData.reduce((acc, item) => acc + item.effectif, 0);
          const femaleCount = subData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = subData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          const disciplineCount = {
            id: subDisciplineIds[k],
            label_fr: label_fr,
            headcount: total,
            femaleCount: femaleCount,
            maleCount: maleCount,
            femalePercent:
              total > 0 ? Math.round((femaleCount / total) * 100) : 0,
            malePercent: total > 0 ? Math.round((maleCount / total) * 100) : 0,
          };

          headcount_per_subject.push(disciplineCount);
        }

        let subAssimilationIds = new Set();
        data.forEach((item) => {
          subAssimilationIds.add(item.code_categorie_assimil);
        });
        subAssimilationIds = [...subAssimilationIds];

        var headcount_per_professional_category = new Array();

        for (let k = 0; k < subAssimilationIds.length; k++) {
          const subData = data.filter(
            (item) => item.code_categorie_assimil === subAssimilationIds[k]
          );

          let assimilation = new Array();
          subData.forEach((item) => {
            assimilation.push(item.categorie_assimilation);
          });

          const label_fr = assimilation.find((element) => element != undefined);
          const total = subData.reduce((acc, item) => acc + item.effectif, 0);
          const femaleCount = subData
            .filter((item) => item.sexe === "Féminin")
            .reduce((acc, item) => acc + item.effectif, 0);
          const maleCount = subData
            .filter((item) => item.sexe === "Masculin")
            .reduce((acc, item) => acc + item.effectif, 0);

          const ageDistPerCategory = [];
          for (let l = 0; l < ageClasses.length; l++) {
            const ageData = subData.filter(
              (item) => item.classe_age3 === ageClasses[l]
            );
            const ageTotal = ageData.reduce(
              (acc, item) => acc + item.effectif,
              0
            );

            if (ageTotal > 0) {
              ageDistPerCategory.push({
                age_class: ageClasses[l],
                headcount: ageTotal,
              });
            }
          }

          const catProCount = {
            id: subAssimilationIds[k],
            label_fr: label_fr,
            headcount: total,
            femaleCount: femaleCount,
            maleCount: maleCount,
            femalePercent:
              total > 0 ? Math.round((femaleCount / total) * 100) : 0,
            malePercent: total > 0 ? Math.round((maleCount / total) * 100) : 0,
            age_distribution: ageDistPerCategory,
          };

          headcount_per_professional_category.push(catProCount);
        }

        const calculElement = {
          geo_id: acaIds[j],
          niveau_geo: "Académie",
          geo_nom: data[0]?.etablissement_academie,
          annee_universitaire: years[i],
          headcountWoman: effectifSexeF,
          headcountMan: effectifSexeM,
          headcountUnknown: effectifSexeNR,
          subject: headcount_per_subject,
          professional_category: headcount_per_professional_category,
          age_distribution: ageDistribution,
          quotite_distribution: quotiteDistribution,
          enseignant_chercheur: {
            headcount: enseignantChercheurCount,
            femaleCount: ecFemaleCount,
            maleCount: ecMaleCount,
            femalePercent:
              enseignantChercheurCount > 0
                ? Math.round((ecFemaleCount / enseignantChercheurCount) * 100)
                : 0,
            malePercent:
              enseignantChercheurCount > 0
                ? Math.round((ecMaleCount / enseignantChercheurCount) * 100)
                : 0,
          },
          non_enseignant_chercheur: {
            headcount: nonEnseignantChercheurCount,
          },
          titulaire: {
            headcount: titulaireCount,
          },
          non_titulaire: {
            headcount: nonTitulaireCount,
          },
        };

        const result = await calculsCollection.insertOne(calculElement);
      }
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
