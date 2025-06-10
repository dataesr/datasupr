import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/";

async function run() {
  try {
    const database = client.db("datasupr");
    const personnelEnseignantCollection = database.collection("teaching-staff");
    const calculsCollection = database.collection(
      "teaching-staff-general-indicators"
    );

    await calculsCollection.deleteMany({});

    const years = await personnelEnseignantCollection.distinct("rentree");
    // const years = [2022,2023];
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

    // Loop for regional
    for (let i = 0; i < years.length; i++) {
      for (let j = 0; j < geoIds.length; j++) {
        const query = {
          etablissement_code_region: geoIds[j],
          rentree: years[i],
        };
        const data = await personnelEnseignantCollection.find(query).toArray();

        const effectifSexeF = data
          .filter((item) => item.sexe === "Féminin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeM = data
          .filter((item) => item.sexe === "Masculin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeNR = data
          .filter((item) => item.sexe === "Non renseigné")
          .reduce((acc, item) => acc + item.effectif, 0);

        // Subjects headcount
        // Get the list of subjects in that area
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

          // The next function allows us to retrieve a label that is not nullish
          let subject = new Array();
          subData.forEach((item) => {
            subject.push(item.grande_discipline);
          });

          const label_fr = subject.find((element) => element != undefined);

          const total = subData.reduce((acc, item) => acc + item.effectif, 0);

          const disciplineCount = {
            id: disciplineIds[k],
            label_fr: label_fr,
            headcount: total,
          };

          headcount_per_subject.push(disciplineCount);
        }

        // Professional categories headcount
        // Get the list of professional categories in that area
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

          // Get the list of professional category
          let assimilation = new Array();
          subData.forEach((item) => {
            assimilation.push(item.categorie_assimilation);
          });

          const label_fr = assimilation.find((element) => element != undefined);

          const total = subData.reduce((acc, item) => acc + item.effectif, 0);

          const catProCount = {
            id: assimilationIds[k],
            label_fr: label_fr,
            headcount: total,
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
        };

        const result = await calculsCollection.insertOne(calculElement);
      }
    }

    // Loop for academie
    for (let i = 0; i < years.length; i++) {
      for (let j = 0; j < acaIds.length; j++) {
        const query = {
          etablissement_code_academie: acaIds[j],
          rentree: years[i],
        };
        const data = await personnelEnseignantCollection.find(query).toArray();

        const effectifSexeF = data
          .filter((item) => item.sexe === "Féminin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeM = data
          .filter((item) => item.sexe === "Masculin")
          .reduce((acc, item) => acc + item.effectif, 0);
        const effectifSexeNR = data
          .filter((item) => item.sexe === "Non renseigné")
          .reduce((acc, item) => acc + item.effectif, 0);

        // Subjects headcount
        // Get the list of subjects in that area
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

          // The next function allows us to retrieve a label that is not nullish
          let subject = new Array();
          subData.forEach((item) => {
            subject.push(item.grande_discipline);
          });

          const label_fr = subject.find((element) => element != undefined);

          const total = subData.reduce((acc, item) => acc + item.effectif, 0);

          const disciplineCount = {
            id: disciplineIds[k],
            label_fr: label_fr,
            headcount: total,
          };

          headcount_per_subject.push(disciplineCount);
        }

        // Professional categories headcount
        // Get the list of professional categories in that area
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

          // Get the list of professional category
          let assimilation = new Array();
          subData.forEach((item) => {
            assimilation.push(item.categorie_assimilation);
          });

          const label_fr = assimilation.find((element) => element != undefined);

          const total = subData.reduce((acc, item) => acc + item.effectif, 0);

          const catProCount = {
            id: assimilationIds[k],
            label_fr: label_fr,
            headcount: total,
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
        };

        const result = await calculsCollection.insertOne(calculElement);
      }
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
