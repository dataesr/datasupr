import express from "express";
import { db } from "../../../../services/mongo.js";

const router = new express.Router();

import { checkQuery } from "../utils.js";

router.route("/european-projects/overview/graph1").get(async (req, res) => {
  const filters = checkQuery(
    req.query,
    ["country_code", "extra_joint_organization", "stage"],
    res
  );

  const data = await db.collection("fr-esr-all-projects-entities").aggregate([
    { $match: filters },
  ]);
});

router.route("/european-projects/synthesis-focus").get(async (req, res) => {
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
        total_coordination_number: dataSuccessful[0].total_coordination_number,
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

router.route("/european-projects/main-beneficiaries").get(async (req, res) => {
  if (!req.query.country_code) {
    res.status(400).send("country_code is required");
    return;
  }

  const filters = checkQuery(req.query, ["country_code"], res);
  filters.framework = "Horizon Europe";
  const data = await db
    .collection("fr-esr-horizon-projects-entities")
    .aggregate([
      {
        $match: filters,
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

router.route("/european-projects/funded-objectives").get(async (req, res) => {
  const filters = checkQuery(
    req.query,
    ["country_code", "extra_joint_organization", "stage"],
    res
  );
  const data = await db
    .collection("fr-esr-all-projects-synthese")
    .aggregate([
      { $match: filters },
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

router.route("/european-projects/overview/destination-funding").get(async (req, res) => {
  const filters = checkQuery(req.query, ["country_code"], res);

  // test filters (thematics, programs, thematics, destinations) 
  if (req.query.pillars) {
    const pillars = req.query.pillars.split("|");
    filters.pilier_code = { $in: pillars };
  }
  if (req.query.programs) {
    const programs = req.query.programs.split("|");
    filters.programme_code = { $in: programs };
  }
  if (req.query.thematics) {
    const thematics = req.query.thematics.split("|");
    const filteredThematics = thematics.filter(thematic => !['ERC', 'MSCA'].includes(thematic));
    filters.thema_code = { $in: filteredThematics };
  }
  if (req.query.destinations) {
    const destinations = req.query.destinations.split("|");
    filters.destination_code = { $in: destinations };
  }

  const data = await db
    .collection("fr-esr-all-projects-synthese")
    .aggregate([
      { $match: { $and: [filters] } },
      {
        $group: {
          _id: {
            destination: "$destination_code",
            stage: "$stage",
          },
          total_fund_eur: { $sum: "$fund_eur" },
        },
      },
      {
        $project: {
          _id: 0,
          destination: "$_id.destination",
          stage: "$_id.stage",
          total_fund_eur: 1,
        },
      },
      { $sort: { total_fund_eur: -1 } },
    ])
    .toArray();

  const successRates = data.reduce((acc, item) => {
    const destination = item.destination;
    if (!acc[destination]) {
      acc[destination] = { successful: 0, evaluated: 0 };
    }
    if (item.stage === "successful") {
      acc[destination].successful += item.total_fund_eur;
    } else if (item.stage === "evaluated") {
      acc[destination].evaluated += item.total_fund_eur;
    }
    return acc;
  }, {});

  const successRateByDestination = Object.entries(successRates).map(
    ([destination, { successful, evaluated }]) => ({
      destination,
      successRate: evaluated > 0 ? successful / evaluated : 0,
    })
  );

  res.json({ data, successRateByDestination });
});

router.route("/european-projects/overview/destination-funding-proportion").get(async (req, res) => {
  const filters = checkQuery(req.query, ["country_code"], res);

  // test filters (thematics, programs, thematics, destinations)
  
  if (req.query.pillars) {
    const pillars = req.query.pillars.split("|");
    filters.pilier_code = { $in: pillars };
  }
  if (req.query.programs) {
    const programs = req.query.programs.split("|");
    filters.programme_code = { $in: programs };
  }
  if (req.query.thematics) {
    const thematics = req.query.thematics.split("|");
    const filteredThematics = thematics.filter(thematic => !['ERC', 'MSCA'].includes(thematic));
    filters.thema_code = { $in: filteredThematics };
  }
  if (req.query.destinations) {
    const destinations = req.query.destinations.split("|");
    filters.destination_code = { $in: destinations };
  }

  const data_country = await db
    .collection("fr-esr-all-projects-synthese")
    .aggregate([
      { $match: { $and: [filters] } },
      {
        $group: {
          _id: {
            destination: "$destination_code",
            stage: "$stage",
          },
          total_fund_eur: { $sum: "$fund_eur" },
        },
      },
      {
        $project: {
          _id: 0,
          destination: "$_id.destination",
          stage: "$_id.stage",
          total_fund_eur: 1,
        },
      },
      { $sort: { total_fund_eur: -1 } },
    ])
    .toArray();

  // get all data without filter on country_code
  const filters_all = { ...filters };
  delete filters_all.country_code;

  const data_all = await db
    .collection("fr-esr-all-projects-synthese")
    .aggregate([
      { $match: { $and: [filters_all] } },
      {
        $group: {
          _id: {
            destination: "$destination_code",
            stage: "$stage",
          },
          total_fund_eur: { $sum: "$fund_eur" },
        },
      },
      {
        $project: {
          _id: 0,
          destination: "$_id.destination",
          stage: "$_id.stage",
          total_fund_eur: 1,
        },
      },
      { $sort: { total_fund_eur: -1 } },
    ])
    .toArray();

  // calculate the proportion of each destination in the country data compared to the all data
  const data = data_country.map((item) => {
    // const destination = item.destination;
    const total_fund_eur_country = item.total_fund_eur;
    const total_fund_eur_all = data_all.find(
      (el) => el.destination === item.destination && el.stage === item.stage
    )?.total_fund_eur;

    return {
      destination: item.destination,
      stage: item.stage,
      proportion: total_fund_eur_all
        ? (total_fund_eur_country / total_fund_eur_all) * 100
        : 0,
    };
  }
  );
  // sort by proportion
  data.sort((a, b) => b.proportion - a.proportion);
  // remove duplicates
  const uniqueDestinations = new Set();
  const filteredData = data.filter((item) => {
    if (uniqueDestinations.has(item.destination)) {
      return false;
    }
    uniqueDestinations.add(item.destination);
    return true;
  });

  res.json({ data });
});

router
  .route(
    "/european-projects/overview/pillars-funding-evo-3-years"
  )
  .get(async (req, res) => {
    const filters = checkQuery(req.query, ["country_code"], res);
    
    // cas de plusieurs piliers passés en paramètre
    if (req.query.pilier_code?.split("|").length > 1) {
      filters.pilier_code = { $in: req.query.pilier_code.split("|") };
    } else if (req.query.pilier_code?.length ===1) {
      filters.pilier_code = req.query.pilier_code;
    } else {
      filters.pilier_code = { $in: ["p1", "p2", "p3", "p4"] };
    }

    const rangeOfYears = ["2021", "2022", "2023"];
    filters.call_year = { $in: rangeOfYears };

    delete filters.thema_code
    delete filters.programme_code
    delete filters.destination_code

    const query = () => {
      return db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        {
          $match: { $and: [filters] },
        },
        {
          $group: {
            _id: {
              stage: "$stage",
              pilier_code: "$pilier_code",
              pilier_name_fr: "$pilier_name_fr",
              pilier_name_en: "$pilier_name_en",
              call_year: "$call_year",
            },
            total_fund_eur: { $sum: "$fund_eur" },
            total_coordination_number: { $sum: "$coordination_number" },
            total_number_involved: { $sum: "$number_involved" },
          },
        },
        {
          $group: {
            _id: {
              stage: "$_id.stage",
              pilier_code: "$_id.pilier_code",
              pilier_name_fr: "$_id.pilier_name_fr",
              pilier_name_en: "$_id.pilier_name_en"
            },
            years: {
              $push: {
                year: "$_id.call_year",
                total_fund_eur: "$total_fund_eur",
                total_coordination_number: "$total_coordination_number",
                total_number_involved: "$total_number_involved"
              }
            }
          }
        },
        {
          $addFields: {
            years: {
              $sortArray: {
                input: "$years",
                sortBy: { year: 1 }
              }
            }
          }
        },
        {
          $group: {
            _id: "$_id.stage",
            pillars: {
              $push: {
                pilier_code: "$_id.pilier_code",
                pilier_name_fr: "$_id.pilier_name_fr", 
                pilier_name_en: "$_id.pilier_name_en",
                years: "$years"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            stage: "$_id",
            pillars: 1
          }
        }
      ])
      .toArray();
    }

    const data_country = await query();
    delete filters.country_code;
    const data_all = await query();

    return res.json([
      {
        country: req.query.country_code,
        data: data_country,
      },
      { country: "all", data: data_all },
    ]);
  });

router
  .route(
    "/european-projects/overview/programs-funding-evo-3-years"
  )
  .get(async (req, res) => {
    const filters = checkQuery(req.query, ["country_code"], res);
    
    // cas de plusieurs programmes passés en paramètre
    if (req.query.programme_code?.split("|").length > 1) {
      filters.programme_code = { $in: req.query.programme_code.split("|") };
    } else if (req.query.programme_code?.split("|").length === 1) {
      filters.programme_code = req.query.programme_code;
    }

    const rangeOfYears = ["2021", "2022", "2023"];
    filters.call_year = { $in: rangeOfYears };

    delete filters.pilier_code
    delete filters.thema_code
    delete filters.destination_code

    console.log(filters);
    
    const query = () => {
      return db
      .collection("fr-esr-all-projects-synthese")
      .aggregate([
        {
          $match: { $and: [filters] },
        },
        {
          $group: {
            _id: {
              stage: "$stage",
              programme_code: "$programme_code",
              programme_name_fr: "$programme_name_fr",
              programme_name_en: "$programme_name_en",
              call_year: "$call_year",
            },
            total_fund_eur: { $sum: "$fund_eur" },
            total_coordination_number: { $sum: "$coordination_number" },
            total_number_involved: { $sum: "$number_involved" },
          },
        },
        {
          $group: {
            _id: {
              stage: "$_id.stage",
              programme_code: "$_id.programme_code",
              programme_name_fr: "$_id.programme_name_fr",
              programme_name_en: "$_id.programme_name_en"
            },
            years: {
              $push: {
                year: "$_id.call_year",
                total_fund_eur: "$total_fund_eur",
                total_coordination_number: "$total_coordination_number",
                total_number_involved: "$total_number_involved"
              }
            }
          }
        },
        {
          $addFields: {
            years: {
              $sortArray: {
                input: "$years",
                sortBy: { year: 1 }
              }
            }
          }
        },
        {
          $group: {
            _id: "$_id.stage",
            programs: {
              $push: {
                programme_code: "$_id.programme_code",
                programme_name_fr: "$_id.programme_name_fr", 
                programme_name_en: "$_id.programme_name_en",
                years: "$years"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            stage: "$_id",
            programs: 1
          }
        }
      ])
      .toArray();
    }

    const data_country = await query();
    delete filters.country_code;
    const data_all = await query();

    return res.json([
      {
        country: req.query.country_code,
        data: data_country,
      },
      { country: "all", data: data_all },
    ]);
  });

export default router;
