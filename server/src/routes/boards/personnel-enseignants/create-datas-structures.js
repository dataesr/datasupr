import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/";

const client = new MongoClient(mongoUri);

async function run() {
    try  {
        const database = client.db("datasupr");
        const personnelEnseignantCollection = database.collection("test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement");
        const calculsCollection  = database.collection("teaching-staff-per-structure");

        // Next line delete ALL documents of table teaching-staff-per-structure, it avoids having duplicates
        // Proceeds with caution
        await calculsCollection.deleteMany({});

        // const years = await personnelEnseignantCollection.distinct("rentree");
        const years = [2020,2021,2022,2023]
        const structureIds = await personnelEnseignantCollection.distinct("etablissement_id_paysage");
        const catProIds = await personnelEnseignantCollection.distinct("code_categorie_pers");
        const disciplineIds = await personnelEnseignantCollection.distinct("code_grande_discipline");
        const cnuIds = await personnelEnseignantCollection.distinct("code_groupe_cnu");


        // This loop build a unique document per year per structure
        for (let i = 0; i < years.length; i++) {
            for (let j = 0; j < structureIds.length; j++) {
                const query = { etablissement_id_paysage: structureIds[j], rentree: years[i] };
                const data = await personnelEnseignantCollection.find(query).toArray();
                
                // Distribution per professional categories per discipline CNU
                var headcount_professional_categories = new Array();

                for (let k = 0; k < catProIds.length; k++) {
                    const subData = data.filter((item) => item.code_categorie_pers ===  catProIds[k]);

                    const number_w = subData.filter((item) => item.sexe === 'Féminin').reduce((acc, item) => acc + item.effectif, 0);
                    const number_m = subData.filter((item) => item.sexe === 'Masculin').reduce((acc, item) => acc + item.effectif, 0);
                    const number_gender_u = subData.filter((item) => item.sexe === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);

                    var headcount_subDiscipline = new Array();

                    for (let l = 0; l < cnuIds.length; l++) {
                        const subDisciplineData = subData.filter((item) => item.code_groupe_cnu ===  cnuIds[l]);

                        const number_woman = subDisciplineData.filter((item) => item.sexe === 'Féminin').reduce((acc, item) => acc + item.effectif, 0);
                        const number_man = subDisciplineData.filter((item) => item.sexe === 'Masculin').reduce((acc, item) => acc + item.effectif, 0);
                        const number_gender_unknown = subDisciplineData.filter((item) => item.sexe === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);
                        const total = subDisciplineData.reduce((acc, item) => acc + item.effectif, 0);

                        const cnuCount = {
                            id: cnuIds[l],
                            label_fr: subDisciplineData[l]?.groupe_cnu,
                            headcount: total,
                            number_woman: number_woman,
                            number_man: number_man,
                            number_gender_unknown: number_gender_unknown,
                        };

                        headcount_subDiscipline.push(cnuCount);
                    };         

                    const headcountCatPro = {
                        id_cat_pro: catProIds[k],
                        label_cat_pro: subData[0]?.categorie_personnels,
                        number_woman: number_w,
                        number_man: number_m,
                        number_gender_unknown: number_gender_u,
                        number_per_cnu : headcount_subDiscipline,
                    };

                    headcount_professional_categories.push(headcountCatPro);

                };

                // Distribution per discipline CNU
                var headcount_cnu = new Array();

                for (let m = 0; m < cnuIds.length; m++) {
                    const subData = data.filter((item) => item.code_groupe_cnu ===  cnuIds[m]);

                    const number_w = subData.filter((item) => item.sexe === 'Féminin').reduce((acc, item) => acc + item.effectif, 0);
                    const number_m = subData.filter((item) => item.sexe === 'Masculin').reduce((acc, item) => acc + item.effectif, 0);
                    const number_gender_u = subData.filter((item) => item.sexe === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);

                    var headcount_cat = new Array();

                    for (let n = 0; n < catProIds.length; n++) {
                        const subDisciplineData = subData.filter((item) => item.code_categorie_pers ===  catProIds[n]);

                        const number_woman = subDisciplineData.filter((item) => item.sexe === 'Féminin').reduce((acc, item) => acc + item.effectif, 0);
                        const number_man = subDisciplineData.filter((item) => item.sexe === 'Masculin').reduce((acc, item) => acc + item.effectif, 0);
                        const number_gender_unknown = subDisciplineData.filter((item) => item.sexe === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);
                        const total = subDisciplineData.reduce((acc, item) => acc + item.effectif, 0);

                        const catCount = {
                            id: catProIds[n],
                            label_fr: subDisciplineData[n]?.categorie_personnels,
                            headcount: total,
                            number_woman: number_woman,
                            number_man: number_man,
                            number_gender_unknown: number_gender_unknown,
                        };

                        headcount_cat.push(catCount);
                    };         

                    const headcountCNU = {
                        id_cat_pro: cnuIds[m],
                        label_cat_pro: subData[0]?.groupe_cnu,
                        number_woman: number_w,
                        number_man: number_m,
                        number_gender_unknown: number_gender_u,
                        number_per_professional_categories : headcount_cat,
                    };

                    headcount_cnu.push(headcountCNU);

                };

                // Distribution per discipline then distribution per discipline CNU
                var headcount_discipline = new Array();

                for (let o = 0; o < disciplineIds.length; o++) {
                    const subData = data.filter((item) => item.code_grande_discipline ===  disciplineIds[o]);

                    const number_w = subData.filter((item) => item.sexe === 'Féminin').reduce((acc, item) => acc + item.effectif, 0);
                    const number_m = subData.filter((item) => item.sexe === 'Masculin').reduce((acc, item) => acc + item.effectif, 0);
                    const number_gender_u = subData.filter((item) => item.sexe === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);

                    // Get the list of subdiscipline associated to the parent discipline
                    let subCnuIds = new Set();
                    subData.forEach((item) => {
                        subCnuIds.add((item.code_groupe_cnu))
                    });
                    subCnuIds = [...subCnuIds]

                    var headcount_subDiscipline = new Array();

                    for (let p = 0; p < subCnuIds.length; p++) {
                        const subDisciplineData = subData.filter((item) => item.code_groupe_cnu ===  subCnuIds[p]);

                        const number_woman = subDisciplineData.filter((item) => item.sexe === 'Féminin').reduce((acc, item) => acc + item.effectif, 0);
                        const number_man = subDisciplineData.filter((item) => item.sexe === 'Masculin').reduce((acc, item) => acc + item.effectif, 0);
                        const number_gender_unknown = subDisciplineData.filter((item) => item.sexe === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);
                        const total = subDisciplineData.reduce((acc, item) => acc + item.effectif, 0);

                        const cnuCount = {
                            id: subCnuIds[p],
                            label_fr: subDisciplineData[p]?.groupe_cnu,
                            headcount: total,
                            number_woman: number_woman,
                            number_man: number_man,
                            number_gender_unknown: number_gender_unknown,
                        };

                        headcount_subDiscipline.push(cnuCount);
                    };

                    const headcountDiscipline = {
                        id_discipline: disciplineIds[o],
                        label_discipline: subData[0]?.grande_discipline,
                        number_woman: number_w,
                        number_man: number_m,
                        number_gender_unknown: number_gender_u,
                        number_per_cnu : headcount_subDiscipline,
                    };

                    headcount_discipline.push(headcountDiscipline);
                };

                // Aggregate indicators
                const number_woman = data.filter((item) => item.sexe === 'Féminin').reduce((acc, item) => acc + item.effectif, 0);
                const number_man = data.filter((item) => item.sexe === 'Masculin').reduce((acc, item) => acc + item.effectif, 0);
                const number_gender_unknown = data.filter((item) => item.sexe === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);

                const number_under_35 = data.filter((item) => item.classe_age3 === '35 ans et moins').reduce((acc, item) => acc + item.effectif, 0);
                const number_over35_under56 = data.filter((item) => item.classe_age3 === '36 à 55 ans').reduce((acc, item) => acc + item.effectif, 0);
                const number_over56 = data.filter((item) => item.classe_age3 === '56 ans et plus').reduce((acc, item) => acc + item.effectif, 0);
                const number_age_unknown = data.filter((item) => item.classe_age3 === 'Non précisé').reduce((acc, item) => acc + item.effectif, 0);

                const number_full_time = data.filter((item) => item.quotite === 'Temps plein').reduce((acc, item) => acc + item.effectif, 0);
                const number_part_time = data.filter((item) => item.quotite === 'Temps partiel').reduce((acc, item) => acc + item.effectif, 0);
                const number_time_unknown = data.filter((item) => item.quotite === 'Non renseigné').reduce((acc, item) => acc + item.effectif, 0);

                // get the rigth label for etablissement

                // data.forEach((item) => console.log(structureIds[j], item.etablissement_actuel_lib));
                
                const calculElement = {
                    structure_id: structureIds[j],
                    structure_name: data[0]?.etablissement_lib,
                    academic_year: years[i],
                    number_woman: number_woman,
                    number_man: number_man,
                    number_gender_unknown: number_gender_unknown,
                    number_under_35: number_under_35,
                    number_over35_under56: number_over35_under56,
                    number_over56: number_over56,
                    number_age_unknown: number_age_unknown,
                    number_full_time: number_full_time,
                    number_part_time: number_part_time,
                    number_time_unknown: number_time_unknown,
                    number_per_professional_categories : headcount_professional_categories,
                    number_per_cnu: headcount_cnu,
                    number_per_discipline: headcount_discipline,
                };
                
                const result = await calculsCollection.insertOne(calculElement);   

            };
        };

    } finally {
        await client.close();
    }

}
run().catch(console.dir);