import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = express.Router();

router.get("/faculty-members-by-region", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-geo-by-region");
    const { year } = req.query;

    const query = { niveau_geo: "Région" };
    if (year) {
      query.annee_universitaire = parseInt(year, 10);
    }

    const regionsData = await collection.find(query).toArray();

    const transformedData = regionsData.map((region) => ({
      geo_id: region.geo_id,
      geo_nom: region.geo_nom,
      annee_universitaire: region.annee_universitaire,
      demographie: {
        total:
          (region.headcountWoman || 0) +
          (region.headcountMan || 0) +
          (region.headcountUnknown || 0),
        femmes: {
          nombre: region.headcountWoman || 0,
          pourcentage:
            region.headcountWoman &&
            region.headcountWoman +
              region.headcountMan +
              region.headcountUnknown >
              0
              ? Math.round(
                  (region.headcountWoman /
                    (region.headcountWoman +
                      region.headcountMan +
                      region.headcountUnknown)) *
                    100
                )
              : 0,
        },
        hommes: {
          nombre: region.headcountMan || 0,
          pourcentage:
            region.headcountMan &&
            region.headcountWoman +
              region.headcountMan +
              region.headcountUnknown >
              0
              ? Math.round(
                  (region.headcountMan /
                    (region.headcountWoman +
                      region.headcountMan +
                      region.headcountUnknown)) *
                    100
                )
              : 0,
        },
        non_specifie: {
          nombre: region.headcountUnknown || 0,
          pourcentage:
            region.headcountUnknown &&
            region.headcountWoman +
              region.headcountMan +
              region.headcountUnknown >
              0
              ? Math.round(
                  (region.headcountUnknown /
                    (region.headcountWoman +
                      region.headcountMan +
                      region.headcountUnknown)) *
                    100
                )
              : 0,
        },
      },
      disciplines: region.subject || [],
      categories_professionnelles: region.professional_category || [],
      age_distribution: region.age_distribution || [],
      quotite_distribution: region.quotite_distribution || [],
      statuts: {
        enseignant_chercheur: region.enseignant_chercheur || {
          headcount: 0,
          femaleCount: 0,
          maleCount: 0,
        },
        non_enseignant_chercheur: region.non_enseignant_chercheur || {
          headcount: 0,
        },
        titulaire: region.titulaire || { headcount: 0 },
        non_titulaire: region.non_titulaire || { headcount: 0 },
      },
    }));

    let response;
    if (!year) {
      response = transformedData.reduce((acc, region) => {
        const year = region.annee_universitaire;
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(region);
        return acc;
      }, {});
    } else {
      response = transformedData;
    }

    const years = await collection
      .aggregate([
        { $match: { niveau_geo: "Région" } },
        { $group: { _id: "$annee_universitaire" } },
        { $sort: { _id: 1 } },
      ])
      .toArray()
      .then((result) => result.map((item) => item._id));

    res.json({
      data: response,
      years: years,
      count: transformedData.length,
      params: { year: year ? parseInt(year, 10) : null },
    });
  } catch (error) {
    console.error("Erreur API (faculty-members-by-region):", error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des données par région",
      error: error.message,
    });
  }
});

router.get("/faculty-members-by-region/:geo_id", async (req, res) => {
  try {
    const collection = db.collection("teaching-staff-geo-by-region");
    const { geo_id } = req.params;
    const { year } = req.query;

    const query = {
      niveau_geo: "Région",
      geo_id: geo_id,
    };

    if (year) {
      query.annee_universitaire = parseInt(year, 10);
    }

    const regionData = await collection.find(query).toArray();

    if (regionData.length === 0) {
      return res.status(404).json({
        message: `Aucune donnée trouvée pour la région avec l'ID ${geo_id}${
          year ? ` et l'année ${year}` : ""
        }`,
      });
    }

    const transformedData = regionData.map((region) => ({
      geo_id: region.geo_id,
      geo_nom: region.geo_nom,
      annee_universitaire: region.annee_universitaire,
      demographie: {
        total:
          (region.headcountWoman || 0) +
          (region.headcountMan || 0) +
          (region.headcountUnknown || 0),
        femmes: {
          nombre: region.headcountWoman || 0,
          pourcentage:
            region.headcountWoman &&
            region.headcountWoman +
              region.headcountMan +
              region.headcountUnknown >
              0
              ? Math.round(
                  (region.headcountWoman /
                    (region.headcountWoman +
                      region.headcountMan +
                      region.headcountUnknown)) *
                    100
                )
              : 0,
        },
        hommes: {
          nombre: region.headcountMan || 0,
          pourcentage:
            region.headcountMan &&
            region.headcountWoman +
              region.headcountMan +
              region.headcountUnknown >
              0
              ? Math.round(
                  (region.headcountMan /
                    (region.headcountWoman +
                      region.headcountMan +
                      region.headcountUnknown)) *
                    100
                )
              : 0,
        },
        non_specifie: {
          nombre: region.headcountUnknown || 0,
          pourcentage:
            region.headcountUnknown &&
            region.headcountWoman +
              region.headcountMan +
              region.headcountUnknown >
              0
              ? Math.round(
                  (region.headcountUnknown /
                    (region.headcountWoman +
                      region.headcountMan +
                      region.headcountUnknown)) *
                    100
                )
              : 0,
        },
      },
      disciplines: region.subject || [],
      categories_professionnelles: region.professional_category || [],
      age_distribution: region.age_distribution || [],
      quotite_distribution: region.quotite_distribution || [],
      statuts: {
        enseignant_chercheur: region.enseignant_chercheur || {
          headcount: 0,
          femaleCount: 0,
          maleCount: 0,
        },
        non_enseignant_chercheur: region.non_enseignant_chercheur || {
          headcount: 0,
        },
        titulaire: region.titulaire || { headcount: 0 },
        non_titulaire: region.non_titulaire || { headcount: 0 },
      },
    }));

    let response;
    if (!year) {
      response = transformedData.reduce((acc, region) => {
        const year = region.annee_universitaire;
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(region);
        return acc;
      }, {});
    } else {
      response = transformedData;
    }

    res.json({
      data: response,
      count: transformedData.length,
      params: {
        geo_id: geo_id,
        year: year ? parseInt(year, 10) : null,
      },
    });
  } catch (error) {
    console.error(
      `Erreur API (faculty-members-by-region/${req.params.geo_id}):`,
      error
    );
    res.status(500).json({
      message: `Une erreur est survenue lors de la récupération des données pour la région ${req.params.geo_id}`,
      error: error.message,
    });
  }
});

export default router;
