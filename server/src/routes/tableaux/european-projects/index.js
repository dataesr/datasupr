import express from "express";
import { db } from "../../../services/mongo";

import funding_programme from "./data/funding_programme.json" assert { type: "json" };

const router = new express.Router();

router.route("/european-projects/funding_programme").get((req, res) => {
  const iso2 = req.query.country_code || "FR";
  res.json(
    funding_programme.filter(
      (item) => item.country_code.toLowerCase() === iso2.toLowerCase()
    )
  );
});

router
  .route("/european-projects/fr-esr-all-projects-synthese")
  .get((req, res) => {
    db.collection("fr-esr-all-projects-synthese")
      .distinct("stage")
      .then((data) => {
        res.json(data);
      });
  });

router
  .route("/european-projects/analysis-synthese-funding_programme")
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send("country_code is required");
      return;
    }
    if (!req.query.stage) {
      res.status(400).send("stage is required");
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }
    const data = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: req.query },
        // { $match: { stage: "successful", country_code: "FRA" } },
        {
          $group: {
            _id: {
              programme_name_en: "$programme_name_en",
              programme_name_fr: "$programme_name_fr",
              pilier_name_en: "$pilier_name_en",
              pilier_name_fr: "$pilier_name_fr",
            },
            total_funding: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            programme_name_en: "$_id.programme_name_en",
            programme_name_fr: "$_id.programme_name_fr",
            pilier_name_en: "$_id.pilier_name_en",
            pilier_name_fr: "$_id.pilier_name_fr",
            total_funding: 1,
          },
        },
        { $sort: { total_funding: -1 } },
      ])
      .toArray();
    res.json(data);
  });

router
  .route("/european-projects/analysis-synthese-focus")
  .get(async (req, res) => {
    const dataSuccessful = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: { stage: "successful" } },
        {
          $group: {
            _id: "$country_code",
            total_fund_eur: { $sum: "$fund_eur" },
            total_involved: { $sum: "$number_involved" },
            total_coordination_number: { $sum: "$coordination_number" },
          },
        },
        {
          $project: {
            _id: 0,
            total_fund_eur: 1,
            total_involved: 1,
            total_coordination_number: 1,
            country_code: "$_id",
          },
        },
        {
          $group: {
            _id: null,
            total_fund_eur: { $sum: "$total_fund_eur" },
            total_involved: { $sum: "$total_involved" },
            total_coordination_number: { $sum: "$total_coordination_number" },
            countries: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            total_fund_eur: 1,
            total_involved: 1,
            total_coordination_number: 1,
            countries: 1,
          },
        },
      ])
      .toArray();

    const dataEvaluated = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: { stage: "evaluated" } },
        {
          $group: {
            _id: "$country_code",
            total_fund_eur: { $sum: "$fund_eur" },
            total_involved: { $sum: "$number_involved" },
            total_coordination_number: { $sum: "$coordination_number" },
          },
        },
        {
          $project: {
            _id: 0,
            total_fund_eur: 1,
            total_involved: 1,
            total_coordination_number: 1,
            country_code: "$_id",
          },
        },
        {
          $group: {
            _id: null,
            total_fund_eur: { $sum: "$total_fund_eur" },
            total_involved: { $sum: "$total_involved" },
            total_coordination_number: { $sum: "$total_coordination_number" },
            countries: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            total_fund_eur: 1,
            total_involved: 1,
            total_coordination_number: 1,
            countries: 1,
          },
        },
      ])
      .toArray();

    if (req.query.country_code) {
      res.json({
        successful: {
          total_fund_eur: dataSuccessful[0].total_fund_eur,
          total_involved: dataSuccessful[0].total_involved,
          total_coordination_number:
            dataSuccessful[0].total_coordination_number,
          countries: dataSuccessful[0].countries.filter(
            (el) =>
              el.country_code.toLowerCase() ===
              req.query.country_code.toLowerCase()
          ),
        },
        evaluated: {
          total_fund_eur: dataEvaluated[0].total_fund_eur,
          total_involved: dataEvaluated[0].total_involved,
          total_coordination_number: dataEvaluated[0].total_coordination_number,
          countries: dataEvaluated[0].countries.filter(
            (el) =>
              el.country_code.toLowerCase() ===
              req.query.country_code.toLowerCase()
          ),
        },
      });
    }
    res.json({
      successful: dataSuccessful[0],
      evaluated: dataEvaluated[0],
    });
  });

router
  .route("/european-projects/analysis-synthese-projects-types-1")
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send("country_code is required");
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }
    const data_country = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: { country_code: req.query.country_code } },
        {
          $group: {
            _id: {
              stage: "$stage",
              action_id: "$action_id",
              action_name: "$action_name",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            action_id: "$_id.action_id",
            action_name: "$_id.action_name",
          },
        },
        {
          $group: {
            _id: {
              id: "$action_id",
              name: "$action_name",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { id: 1 } },
      ])
      .toArray();

    const data_all = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        // { $match: { country_code: req.query.country_code } },
        {
          $group: {
            _id: {
              stage: "$stage",
              action_id: "$action_id",
              action_name: "$action_name",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            action_id: "$_id.action_id",
            action_name: "$_id.action_name",
          },
        },
        {
          $group: {
            _id: {
              id: "$action_id",
              name: "$action_name",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { id: 1 } },
      ])
      .toArray();

    // remove empty data
    const country = [];
    data_country.forEach((el) => {
      if (el.total_successful > 0 || el.total_evaluated > 0) {
        country.push(el);
      }
    });

    const all = [];
    data_all.forEach((el) => {
      if (el.total_successful > 0 || el.total_evaluated > 0) {
        all.push(el);
      }
    });

    return res.json({ country, all });
  });

router
  .route("/european-projects/analysis-synthese-projects-types-2")
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send("country_code is required");
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }
    const dataSelectedCountry = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: { country_code: req.query.country_code } },
        {
          $group: {
            _id: {
              stage: "$stage",
              action_id: "$action_id",
              action_name: "$action_name",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            action_id: "$_id.action_id",
            action_name: "$_id.action_name",
          },
        },
        {
          $group: {
            _id: {
              id: "$action_id",
              name: "$action_name",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { id: 1 } },
      ])
      .toArray();

    const otherCountries = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: { country_association_code: "MEMBER-ASSOCIATED" } },
        {
          $group: {
            _id: {
              stage: "$stage",
              action_id: "$action_id",
              action_name: "$action_name",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            action_id: "$_id.action_id",
            action_name: "$_id.action_name",
          },
        },
        {
          $group: {
            _id: {
              id: "$action_id",
              name: "$action_name",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { id: 1 } },
      ])
      .toArray();

    // const data = await db.collection('fr-esr-all-projects-synthese')
    //   .aggregate([
    //     { $match: { country_association_code: "MEMBER-ASSOCIATED" } },
    //     {
    //       $group: {
    //         _id: {
    //           stage: "$stage",
    //           action_id: "$action_id",
    //           action_name: "$action_name",
    //           country_code: "$country_code",
    //           country_association_code: "$country_association_code",
    //         },
    //         total_fund_eur: { $sum: "$fund_eur" },
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         stage: "$_id.stage",
    //         total_fund_eur: 1,
    //         action_id: "$_id.action_id",
    //         action_name: "$_id.action_name",
    //         country_code: "$_id.country_code",
    //         country_association_code: "$_id.country_association_code",
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: null,
    //         selectedCountry: {
    //           $push: { $cond: [{ $eq: ["$country_code", req.query.country_code] }, "$$ROOT", null] }
    //         },
    //         otherCountries: {
    //           $push: { $cond: [{ $ne: ["$country_code", req.query.country_code] }, "$$ROOT", null] }
    //         },
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         selectedCountry: {
    //           $filter:
    //           {
    //             input: "$selectedCountry",
    //             as: "selectedCountryFiltered",
    //             cond: { $ne: ["$$selectedCountryFiltered", null] },

    //           }
    //         },
    //         otherCountries: {
    //           $filter:
    //           {
    //             input: "$otherCountries",
    //             as: "otherCountriesFiltered",
    //             cond: { $ne: ["$$otherCountriesFiltered", null] },
    //           }
    //         },
    //       }
    //     },
    //   ]).toArray();

    const data = {
      selectedCountry: dataSelectedCountry.map((el) => {
        if (el.total_evaluated === 0) {
          return { ...el, ratio: 0 };
        }
        return {
          ...el,
          ratio: (el.total_successful / el.total_evaluated) * 100,
        };
      }),
      otherCountries: otherCountries.map((el) => {
        if (el.total_evaluated === 0) {
          return { ...el, ratio: 0 };
        }
        return {
          ...el,
          ratio: (el.total_successful / el.total_evaluated) * 100,
        };
      }),
    };

    return res.json(data);
  });

router
  .route(
    "/european-projects/general-objectives-and-projects-types-piliers-subventions-1"
  )
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send("country_code is required");
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }

    const data_country = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: { country_code: req.query.country_code } },
        {
          $group: {
            _id: {
              stage: "$stage",
              pilier_name_fr: "$pilier_name_fr",
              pilier_name_en: "$pilier_name_en",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            pilier_name_fr: "$_id.pilier_name_fr",
            pilier_name_en: "$_id.pilier_name_en",
          },
        },
        {
          $group: {
            _id: {
              id: "$pilier_name_fr",
              name: "$pilier_name_en",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { id: 1 } },
      ])
      .toArray();

    const data_all = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        {
          $group: {
            _id: {
              stage: "$stage",
              pilier_name_fr: "$pilier_name_fr",
              pilier_name_en: "$pilier_name_en",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            pilier_name_fr: "$_id.pilier_name_fr",
            pilier_name_en: "$_id.pilier_name_en",
          },
        },
        {
          $group: {
            _id: {
              id: "$pilier_name_fr",
              name: "$pilier_name_en",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { id: 1 } },
      ])
      .toArray();

    // remove empty data
    const country = [];
    data_country.forEach((el) => {
      if (el.total_successful > 0 || el.total_evaluated > 0) {
        country.push(el);
      }
    });

    const all = [];
    data_all.forEach((el) => {
      if (el.total_successful > 0 || el.total_evaluated > 0) {
        all.push(el);
      }
    });

    return res.json({ country, all });
  });

router
  .route(
    "/european-projects/general-objectives-and-projects-types-piliers-subventions-2"
  )
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send("country_code is required");
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }
    const rangeOfYears = ["2021", "2022", "2023"];
    const data_country = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        {
          $match: {
            country_code: req.query.country_code,
            call_year: { $in: rangeOfYears },
          },
        },
        {
          $group: {
            _id: {
              stage: "$stage",
              pilier_name_fr: "$pilier_name_fr",
              call_year: "$call_year",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            pilier_name_fr: "$_id.pilier_name_fr",
            call_year: "$_id.call_year",
          },
        },
        {
          $group: {
            _id: {
              name: "$pilier_name_fr",
              year: "$call_year",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            pilier_name_fr: "$_id.name",
            year: "$_id.year",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { pilier_name_fr: 1, year: 1 } },
      ])
      .toArray();

    const data_all = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        {
          $group: {
            _id: {
              stage: "$stage",
              pilier_name_fr: "$pilier_name_fr",
              call_year: "$call_year",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            stage: "$_id.stage",
            total_fund_eur: 1,
            pilier_name_fr: "$_id.pilier_name_fr",
            call_year: "$_id.call_year",
          },
        },
        {
          $group: {
            _id: {
              name: "$pilier_name_fr",
              year: "$call_year",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            pilier_name_fr: "$_id.name",
            year: "$_id.year",
            total_successful: 1,
            total_evaluated: 1,
          },
        },
        { $sort: { pilier_name_fr: 1 } },
      ])
      .toArray();

    return res.json([
      {
        country: req.query.country_code,
        data: data_country,
      },
      { country: "all", data: data_all },
    ]);
  });

router
  .route("/european-projects/analysis-synthese-main-beneficiaries")
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send("country_code is required");
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }
    const data = await db
      .collection("fr-esr-horizon-projects-entities")
      .aggregate([
        {
          $match: {
            framework: "Horizon Europe",
            country_code: req.query.country_code,
          },
        },
        {
          $group: {
            _id: {
              name: "$entities_name",
              acronym: "$entities_acronym",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            acronym: "$_id.acronym",
            total_fund_eur: 1,
          },
        },
        {
          $sort: { total_fund_eur: -1 },
        },
      ])
      .toArray();

    const total = data.reduce((acc, el) => acc + el.total_fund_eur, 0);
    const half = total / 2;

    // get list who represent 50% of the total
    const list = [];
    let currentTotal = 0;
    for (let i = 0; i < data.length; i++) {
      if (currentTotal < half) {
        list.push(data[i]);
        currentTotal += data[i].total_fund_eur;
      }
    }

    return res.json({ total_fund_eur: total, list });
  });

router
  .route("/european-projects/analysis-positioning-top-10-beneficiaries")
  .get(async (req, res) => {
    const data = await db
      .collection("fr-esr-horizon-projects-entities")
      .aggregate([
        { $match: { framework: "Horizon Europe" } },
        {
          $group: {
            _id: {
              name_fr: "$country_name_fr",
              id: "$country_code",
            },
            total_fund_eur: { $sum: "$fund_eur" },
          },
        },
        {
          $project: {
            _id: 0,
            name_fr: "$_id.name_fr",
            id: "$_id.id",
            total_fund_eur: 1,
          },
        },
        {
          $sort: { total_fund_eur: -1 },
        },
      ])
      .toArray();

    let acc = 0;
    const total_fund_eur = data.reduce((acc, el) => acc + el.total_fund_eur, 0);
    const dataReturn = {
      total_fund_eur,
      top10: data
        .map((el) => {
          if (el.id !== "ZOE" && el.id !== "ZOI") {
            acc += el.total_fund_eur;
            return {
              ...el,
              influence: (acc / total_fund_eur) * 100,
            };
          }
        })
        .filter((el) => el)
        .slice(0, 10),
    };

    return res.json(dataReturn);
  });

router.route("/european-projects/countries").get(async (req, res) => {
  const data = await db
    .collection("fr-esr-all-projects-synthese")
    .aggregate([
      {
        $group: {
          _id: {
            id: "$country_code",
            label: "$country_name_fr",
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id.id",
          label: "$_id.label",
        },
      },
      { $sort: { label: 1 } },
    ])
    .toArray();

  res.json(data);
});

router
  .route("/european-projects/analysis-positioning-top-10-funding-ranking")
  .get(async (req, res) => {
    const data = await db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        { $match: { country_code: { $nin: ["ZOE", "ZOI"] } } },
        {
          $group: {
            _id: {
              id: "$country_code",
              label: "$country_name_fr",
              stage: "$stage",
            },
            total_fund_eur: { $sum: "$fund_eur" },
            total_coordination_number: { $sum: "$coordination_number" },
            total_number_involved: { $sum: "$number_involved" },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            label: "$_id.label",
            total_fund_eur: 1,
            stage: "$_id.stage",
            total_coordination_number: 1,
            total_number_involved: 1,
          },
        },
        {
          $group: {
            _id: {
              id: "$id",
              name: "$label",
            },
            total_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_fund_eur",
                  0,
                ],
              },
            },
            total_evaluated: {
              $sum: {
                $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0],
              },
            },
            total_coordination_number_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_coordination_number",
                  0,
                ],
              },
            },
            total_coordination_number_evaluated: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "evaluated"] },
                  "$total_coordination_number",
                  0,
                ],
              },
            },
            total_number_involved_successful: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "successful"] },
                  "$total_number_involved",
                  0,
                ],
              },
            },
            total_number_involved_evaluated: {
              $sum: {
                $cond: [
                  { $eq: ["$stage", "evaluated"] },
                  "$total_number_involved",
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
            total_coordination_number_successful: 1,
            total_coordination_number_evaluated: 1,
            total_number_involved_successful: 1,
            total_number_involved_evaluated: 1,
          },
        },
      ])
      .toArray();

    const dataWithRatio = data.map((el) => {
      if (el.total_evaluated === 0) {
        return { ...el, ratio: 0 };
      }
      return {
        ...el,
        ratio: (el.total_successful / el.total_evaluated) * 100,
        ratio_coordination_number:
          (el.total_coordination_number_successful /
            el.total_coordination_number_evaluated) *
          100,
        ratio_involved:
          (el.total_number_involved_successful /
            el.total_number_involved_evaluated) *
          100,
      };
    });

    // add successful rank to returned data
    const dataSortedSuccessful = dataWithRatio.sort(
      (a, b) => b.total_successful - a.total_successful
    ); // sort by total_sccessful
    for (let i = 0; i < dataSortedSuccessful.length; i++) {
      dataWithRatio.find(
        (el) => el.id === dataSortedSuccessful[i].id
      ).rank_successful = i + 1;
    }

    // add evaluated rank to returned data
    const dataSortedEvaluated = dataWithRatio.sort(
      (a, b) => b.total_evaluated - a.total_evaluated
    ); // sort by total_evaluated
    for (let i = 0; i < dataSortedEvaluated.length; i++) {
      dataWithRatio.find(
        (el) => el.id === dataSortedEvaluated[i].id
      ).rank_evaluated = i + 1;
    }

    // add coordination_number_successful rank to returned data
    const dataSortedCoordinationNumberSuccessful = dataWithRatio.sort(
      (a, b) =>
        b.total_coordination_number_successful -
        a.total_coordination_number_successful
    ); // sort by total_coordination_number_successful
    for (let i = 0; i < dataSortedCoordinationNumberSuccessful.length; i++) {
      dataWithRatio.find(
        (el) => el.id === dataSortedCoordinationNumberSuccessful[i].id
      ).rank_coordination_number_successful = i + 1;
    }

    // add coordination_number_evaluated rank to returned data
    const dataSortedCoordinationNumberEvaluated = dataWithRatio.sort(
      (a, b) =>
        b.total_coordination_number_evaluated -
        a.total_coordination_number_evaluated
    ); // sort by total_coordination_number_evaluated
    for (let i = 0; i < dataSortedCoordinationNumberEvaluated.length; i++) {
      dataWithRatio.find(
        (el) => el.id === dataSortedCoordinationNumberEvaluated[i].id
      ).rank_coordination_number_evaluated = i + 1;
    }

    // add number_involved_successful rank to returned data
    const dataSortedInvolvedSuccessful = dataWithRatio.sort(
      (a, b) =>
        b.total_number_involved_successful - a.total_number_involved_successful
    ); // sort by total_number_involved_successful
    for (let i = 0; i < dataSortedInvolvedSuccessful.length; i++) {
      dataWithRatio.find(
        (el) => el.id === dataSortedInvolvedSuccessful[i].id
      ).rank_involved_successful = i + 1;
    }

    // add number_involved_evaluated rank to returned data
    const dataSortedInvolvedEvaluated = dataWithRatio.sort(
      (a, b) =>
        b.total_number_involved_evaluated - a.total_number_involved_evaluated
    ); // sort by total_number_involved_evaluated
    for (let i = 0; i < dataSortedInvolvedEvaluated.length; i++) {
      dataWithRatio.find(
        (el) => el.id === dataSortedInvolvedEvaluated[i].id
      ).rank_involved_evaluated = i + 1;
    }

    return res.json(dataWithRatio);
  });

// TODO: remove this route
router.route("/european-projects/template").get(async (req, res) => {
  return res.json([]);
});

export default router;
