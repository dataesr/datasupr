import express from "express";
import { db } from "../../../services/mongo";
import { dbPaysage } from "../../../services/mongo-paysage";
const router = new express.Router();

const mappingRegion = [
  { "R94": "fr-cor" },
  { "R53": "fr-bre" },
  { "R52": "fr-pdl" },
  { "R93": "fr-pac" },
  { "R76": "fr-occ" },
  { "R75": "fr-naq" },
  { "R27": "fr-bfc" },
  { "R24": "fr-cvl" },
  { "R11": "fr-idf" },
  { "R32": "fr-hdf" },
  { "R84": "fr-ara" },
  { "R44": "fr-ges" },
  { "R28": "fr-nor" },
  { "R06": "fr-lre" },
  { "R04": "fr-may" },
  { "R03": "fr-gf" },
  { "R02": "fr-mq" },
  { "R01": "fr-gua" }
]

const filieresOrder = ['CPGE', 'STS', 'UNIV', 'GE', 'UT', 'INP', 'ENS', 'EPEU', 'ING_autres', 'EC_COM', 'EC_JUR', 'EC_ART', 'EC_PARAM', 'EC_autres', 'TOTAL'];

router.route('/atlas/get-geo-polygons')
  .get((req, res) => {
    dbPaysage.collection('geographicalcategories').find(req.query).toArray().then((data) => {
      res.json(data);
    })
  });

router.route('/atlas/number-of-students-map')
  .get((req, res) => {
    const allData = {};
    db.collection('atlas2023').find(req.query, { projection: { "effectif": 1, "geo_id": 1 } }).toArray().then((data) => {
      allData.data = data.map((item) => ({
        effectif: item.effectif,
        geo_id: item.geo_id,
        // geo_nom: item.geo_nom,
        // sexe: item.sexe,
        // secteur: item.secteur,
        // secret: item.secret,
      }));

      const dataMap = [];
      mappingRegion.map((regionObject) => {
        const regionKey = Object.keys(regionObject)[0];
        const regionData = allData?.data.filter((item) => item.geo_id === regionKey);
        let effectif = 0;
        regionData?.map((item) => {
          effectif += item.effectif;
        })

        dataMap.push([regionObject[regionKey], effectif]);
      })

      res.json(dataMap);
    });
  });

router.route('/atlas/number-of-students-historic-by-level')
  .get(async (req, res) => {
    const filters = { ...req.query };
    if (req.query.niveau_geo === "ACADEMIE") {
      filters.niveau_geo = "REGION";
    }
    if (req.query.niveau_geo === "DEPARTEMENT") {
      filters.niveau_geo = "ACADEMIE";
    }
    // if (req.query.niveau_geo === "UNITE_URBAINE") {
    //   filters.niveau_geo = "DEPARTEMENT";
    // }
    if (req.query.niveau_geo === "COMMUNE") {
      filters.niveau_geo = "DEPARTEMENT";
    }


    const response = await db.collection('atlas2023').findOne({ ...filters }, { projection: { "geo_nom": 1 } })
    const levelName = response?.geo_nom;

    db.collection('atlas2023').find(
      req.query,
      {
        projection: {
          effectif: 1,
          geo_id: 1,
          geo_nom: 1,
          annee_universitaire: 1,
          regroupement: 1,
          _id: 0
        }
      }).toArray().then((data) => {

        const years = [...new Set(data.map((item) => item.annee_universitaire))].sort((a, b) => {
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        });

        const geoIds = [...new Set(data.map((item) => item.geo_id))];
        const dataByGeo = [];
        geoIds.map((geo_id) => {
          dataByGeo.push({
            geo_id, // ex: "A24"
            geo_nom: data.find((item) => item.geo_id === geo_id).geo_nom, // ex: "Créteil"
            data: years.map((year) => {
              return {
                annee_universitaire: year,
                effectif: data.filter((item) => item.annee_universitaire === year && item.geo_id === geo_id && item.regroupement === 'TOTAL')?.reduce((acc, item) => acc + item.effectif, 0)
              }
            })
          })
        })

        res.json({
          level_nom: levelName, // ex: "Ile-de-France"
          data: dataByGeo
        });
      });
  });

router.route('/atlas/number-of-students-by-gender-and-level')
  .get(async (req, res) => {
    const filters = { ...req.query };
    if (!req.query.annee_universitaire) {
      filters.annee_universitaire = "2022-23";
    }
    const data = await db.collection('atlas2023').aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            genre: "$sexe",
            regroupement: "$regroupement",
            rgp_formations_ou_etablissements: "$rgp_formations_ou_etablissements",
          },
          effectif: { $sum: "$effectif" }
        }
      },
      { $project: { _id: 0, genre: "$_id.genre", regroupement: "$_id.regroupement", effectif: 1, label: "$_id.rgp_formations_ou_etablissements" } },
      { $sort: { regroupement: 1 } },
      {
        $group: {
          _id: { regroupement: "$regroupement" },
          effectif_masculin: { $sum: { $cond: [{ $eq: ["$genre", "1"] }, "$effectif", 0] } },
          effectif_feminin: { $sum: { $cond: [{ $eq: ["$genre", "2"] }, "$effectif", 0] } },
          effectif_total: { $sum: "$effectif" },
          label: { $first: "$label" }
        },
      },
      { $project: { _id: 0, id: "$_id.regroupement", effectif_masculin: 1, effectif_feminin: 1, effectif_total: 1, label: 1 } },
    ]).toArray()

    const ret = [];
    filieresOrder.map((regroupementId) => {
      const datRegroupement = data.find((item) => item.id === regroupementId);
      if (datRegroupement) {
        ret.push(datRegroupement);
      }
    })

    res.json(ret);
  }
  );


router.route('/atlas/number-of-students')
  .get((req, res) => {
    const filters = { ...req.query };
    if (!req.query.annee_universitaire) {
      filters.annee_universitaire = "2022-23";
    }

    if (!req.query.geo_id) {
      filters.geo_id = "PAYS_100";
    }

    const allData = {};
    db.collection('atlas2023').find(filters).toArray().then((response) => {
      allData.data = response.map((item) => ({
        effectif: item.effectif,
        geo_id: item.geo_id,
        geo_nom: item.geo_nom,
        secteur: item.secteur,
        secteur_de_l_etablissement: item.secteur_de_l_etablissement,
        regroupement: item.regroupement,
        rgp_formations_ou_etablissements: item.rgp_formations_ou_etablissements,
        gender: item.sexe,
        sexe_de_l_etudiant: item.sexe_de_l_etudiant,
        effectif_form_ens: item.effectif_form_ens,
        effectif_ing: item.effectif_ing,
        effectif_dut: item.effectif_dut,
        annee_universitaire: item.annee_universitaire,
      }));

      // // si pas de geo_id, on renvoie le nombre total d'étudiants par région
      // if (!req.query.geo_id) {
      //   const data = [];
      //   mappingRegion.map((regionObject) => {
      //     const regionKey = Object.keys(regionObject)[0];
      //     const regionData = allData?.data.filter((item) => item.geo_id === regionKey);
      //     let effectif = 0;
      //     regionData?.map((item) => {
      //       effectif += item.effectif;
      //     })

      //     data.push([regionObject[regionKey], effectif]);
      //   })
      //   res.json(data);
      // } else {
      const data = {};
      data.geo_id = req.query.geo_id || "FRA";
      data.geo_nom = allData.data[0].geo_nom;
      data.annee_universitaire = filters.annee_universitaire;

      // Secteurs
      data.secteurs = []
      data.secteurs.push({
        id: "PU",
        label: allData.data.find((item) => item.secteur === "PU")?.secteur_de_l_etablissement,
        value: allData.data.filter((item) => item.secteur === "PU")?.reduce((acc, item) => acc + item.effectif, 0)
      })
      data.secteurs.push({
        id: "PR",
        label: allData.data.find((item) => item.secteur === "PR")?.secteur_de_l_etablissement,
        value: allData.data.filter((item) => item.secteur === "PR")?.reduce((acc, item) => acc + item.effectif, 0)
      })

      // Filieres
      data.filieres = []
      filieresOrder.map((regroupementId) => {
        const datRegroupement = allData.data.filter((item) => item.regroupement === regroupementId);
        datRegroupement.map((item) => {
          if (!data.filieres.find((el) => el.id === item.regroupement)) {
            const obj = {
              id: item.regroupement, // ex: CPGE
              label: item.rgp_formations_ou_etablissements,
            }
            obj[`effectif_${item.secteur}`] = item.effectif;

            data.filieres.push(obj);
          } else {
            if (data.filieres.find((el) => el.id === item.regroupement && el[`effectif_${item.secteur}`])) {
              data.filieres.find((el) => el.id === item.regroupement)[`effectif_${item.secteur}`] += item.effectif;
            } else {
              data.filieres.find((el) => el.id === item.regroupement)[`effectif_${item.secteur}`] = item.effectif;
            }

            data.filieres[item.regroupement] += item.effectif;
          }
        })
      })

      // Gender
      data.gender = []
      data.gender.push({
        id: "1",
        label: allData.data.find((item) => item.gender === "1")?.sexe_de_l_etudiant,
        value: allData.data.filter((item) => item.gender === "1")?.reduce((acc, item) => acc + item.effectif, 0)
      })
      data.gender.push({
        id: "2",
        label: allData.data.find((item) => item.gender === "2")?.sexe_de_l_etudiant,
        value: allData.data.filter((item) => item.gender === "2")?.reduce((acc, item) => acc + item.effectif, 0)
      })

      // Effectif ing
      data.effectif_ing = allData.data.reduce((acc, item) => acc + item.effectif_ing, 0);

      // Effectif dut
      data.effectif_dut = allData.data.reduce((acc, item) => acc + item.effectif_dut, 0);

      // Effectif form ens
      data.effectif_form_ens = allData.data.reduce((acc, item) => acc + item.effectif_form_ens, 0);

      res.json(data);
    }
      // }
    );
  });

router.route('/atlas/number-of-students-by-year')
  .get((req, res) => {
    const filters = {};
    if (req.query.geo_id) {
      filters.geo_id = req.query.geo_id;
    } else {
      filters.geo_id = "PAYS_100";
    }
    if (req.query.regroupement) {
      filters.regroupement = req.query.regroupement;
    } else {
      filters.regroupement = "TOTAL";
    }
    db.collection('atlas2023').find(filters).toArray().then((data) => {
      const dataByYear = [];
      data.map((item) => {
        const index = dataByYear.findIndex((el) => el.annee_universitaire === item.annee_universitaire);
        if (index === -1) {
          dataByYear.push({
            annee_universitaire: item.annee_universitaire,
            effectif_total: item.effectif,
            effectif_pr: item.secteur === "PR" ? item.effectif : 0,
            effectif_pu: item.secteur === "PU" ? item.effectif : 0,
            effectif_masculin: item.sexe === "1" ? item.effectif : 0,
            effectif_feminin: item.sexe === "2" ? item.effectif : 0,
            effectif_dut: item.effectif_dut,
            effectif_form_ens: item.effectif_form_ens,
            effectif_ing: item.effectif_ing,
          })
        } else {
          dataByYear[index].effectif_total += item.effectif;
          dataByYear[index].effectif_pr += item.secteur === "PR" ? item.effectif : 0;
          dataByYear[index].effectif_pu += item.secteur === "PU" ? item.effectif : 0;
          dataByYear[index].effectif_masculin += item.sexe === "1" ? item.effectif : 0;
          dataByYear[index].effectif_feminin += item.sexe === "2" ? item.effectif : 0;
          dataByYear[index].effectif_dut += item.effectif_dut;
          dataByYear[index].effectif_form_ens += item.effectif_form_ens;
          dataByYear[index].effectif_ing += item.effectif_ing;
        }
      })

      dataByYear.sort((a, b) => {
        if (a.annee_universitaire > b.annee_universitaire) return 1;
        if (a.annee_universitaire < b.annee_universitaire) return -1;
        return 0;
      })

      res.json(dataByYear);
    });
  });

router.route('/atlas/get-years')
  .get((req, res) => {
    db.collection('atlas2023').distinct("annee_universitaire").then((data) => {
      res.json(data);
    });
  });

router.route('/atlas/get-filieres')
  .get((req, res) => {
    db.collection('atlas2023').distinct("regroupement").then((data) => {
      res.json(data);
    });
  });

router.route('/atlas/get-filters-values')
  .get(async (req, res) => {
    const annee_universitaire = await db.collection('atlas2023').distinct("annee_universitaire");
    const temp = await db.collection('atlas2023').aggregate([
      {
        $group: {
          "_id": {
            geoid: "$geo_id",
            geoname: "$geo_nom",
            geotype: "$niveau_geographique"
          }
        }
      }
    ]
    ).toArray();

    const geo = {
      communes: temp.filter((item) => item._id.geotype === "Commune").map((item) => ({ geo_id: item._id.geoid, geo_nom: item._id.geoname })),
      departements: temp.filter((item) => item._id.geotype === "Département").map((item) => ({ geo_id: item._id.geoid, geo_nom: item._id.geoname })),
      academies: temp.filter((item) => item._id.geotype === "Académie").map((item) => ({ geo_id: item._id.geoid, geo_nom: item._id.geoname })),
      regions: temp.filter((item) => item._id.geotype === "Région").map((item) => ({ geo_id: item._id.geoid, geo_nom: item._id.geoname })),
      unites_urbaines: temp.filter((item) => item._id.geotype === "Unité urbaine").map((item) => ({ geo_id: item._id.geoid, geo_nom: item._id.geoname }))
    }

    const data = {
      annee_universitaire,
      geo_id: geo,
    }
    res.json(data);
  });

router.route('/atlas/get-references')
  .get(async (req, res) => {
    const response = await db.collection('atlas2023').findOne({ ...req.query });
    const { niveau_geo } = response;

    const objMapping = {
      REGION: "reg_id",
      ACADEMIE: "aca_id",
      DEPARTEMENT: "dep_id",
      UNITE_URBAINE: "uu_id",
      COMMUNE: "com_id",
      PAYS: "geo_id",
    }

    const obj = {};
    obj.data = await db.collection('atlas2023').aggregate([
      { $match: { [objMapping[niveau_geo]]: req.query.geo_id } },
      {
        $group: {
          _id: { geo_id: "$geo_id" },
          "geo_nom": { $first: "$geo_nom" },
          "niveau": { $first: "$niveau_geographique" },
          "geo_id": { $first: "$geo_id" }
        }
      },
      { $project: { _id: 0 } },
      { $sort: { geo_nom: 1 } },
      {
        $group: {
          _id: { niveau: "$niveau" },
          data:
            { $push: "$$ROOT" }

        }
      },
      { $project: { "data.niveau": 0 } },
      { $project: { niveau: "$_id.niveau", data: 1, _id: 0 } },
    ]).toArray();

    res.json(obj);

  }
  );

router.route('/atlas/get-similar-elements')
  .get(async (req, res) => {
    const filters = {};

    if (!req.query.niveau_geo) {
      res.status(400).send('niveau_geo is required');
    }
    if (!req.query.needle) {
      res.status(400).send('needle is required');
    }
    if (!req.query.gt) {
      res.status(400).send('gt is required');
    }
    if (!req.query.lt) {
      res.status(400).send('lt is required');
    }
    if (!req.query.annee_universitaire) {
      res.status(400).send('annee_universitaire is required');
    }

    filters.niveau_geo = req.query.niveau_geo;
    filters.annee_universitaire = req.query.annee_universitaire;

    filters[req.query.needle] = { $gt: parseInt(req.query.gt), $lt: parseInt(req.query.lt) };

    console.log(filters);
    db.collection('similar-elements').find(filters).toArray().then((data) => {
      res.json(data);
    })
  });

export default router;
