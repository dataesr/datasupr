import express from "express";
import { db } from "../../../../../services/mongo.js";

const router = new express.Router();

// import { checkQuery } from "../../utils";

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

export default router;
