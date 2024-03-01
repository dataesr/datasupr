import express from "express";
import { db } from "../../../services/mongo";

import evol_all_pc_coordination_EVAL from './data/evol_all_pc_coordination_EVAL.json' assert { type: "json" };
import evol_all_pc_coordination_SIGNED from './data/evol_all_pc_coordination_SIGNED.json' assert { type: "json" };
import evol_all_pc_funding_EVAL from './data/evol_all_pc_funding_EVAL.json' assert { type: "json" };
import evol_all_pc_funding_SIGNED from './data/evol_all_pc_funding_SIGNED.json' assert { type: "json" };
import evol_all_pc_participant_EVAL from './data/evol_all_pc_participant_EVAL.json' assert { type: "json" };
import evol_all_pc_participant_SIGNED from './data/evol_all_pc_participant_SIGNED.json' assert { type: "json" };

import evol_all_pc_project_EVAL from './data/evol_all_pc_project_EVAL.json' assert { type: "json" };
import evol_all_pc_project_SIGNED from './data/evol_all_pc_project_SIGNED.json' assert { type: "json" };
import funding_participant_share_actions from './data/funding_participant_share_actions.json' assert { type: "json" };
import funding_programme from './data/funding_programme.json' assert { type: "json" };

const router = new express.Router();

router.route('/european-projects')
  .get((req, res) => {
    const allData = {};

    if (req.query.countryCode) {
      // filtre de toutes les data sur le pays
      allData['evol_all_pc_coordination_EVAL'] = evol_all_pc_coordination_EVAL.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['evol_all_pc_coordination_SIGNED'] = evol_all_pc_coordination_SIGNED.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['evol_all_pc_funding_EVAL'] = evol_all_pc_funding_EVAL.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['evol_all_pc_funding_SIGNED'] = evol_all_pc_funding_SIGNED.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['evol_all_pc_participant_EVAL'] = evol_all_pc_participant_EVAL.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['evol_all_pc_participant_SIGNED'] = evol_all_pc_participant_SIGNED.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['evol_all_pc_project_EVAL'] = evol_all_pc_project_EVAL.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['evol_all_pc_project_SIGNED'] = evol_all_pc_project_SIGNED.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['funding_participant_share_actions'] = funding_participant_share_actions.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
      allData['funding_programme'] = funding_programme.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
    } else {
      allData['evol_all_pc_coordination_EVAL'] = evol_all_pc_coordination_EVAL.data;
      allData['evol_all_pc_coordination_SIGNED'] = evol_all_pc_coordination_SIGNED.data;
      allData['evol_all_pc_funding_EVAL'] = evol_all_pc_funding_EVAL.data;
      allData['evol_all_pc_funding_SIGNED'] = evol_all_pc_funding_SIGNED.data;
      allData['evol_all_pc_participant_EVAL'] = evol_all_pc_participant_EVAL.data;
      allData['evol_all_pc_participant_SIGNED'] = evol_all_pc_participant_SIGNED.data;
      allData['evol_all_pc_project_EVAL'] = evol_all_pc_project_EVAL.data;
      allData['evol_all_pc_project_SIGNED'] = evol_all_pc_project_SIGNED.data;
      allData['funding_participant_share_actions'] = funding_participant_share_actions;
      allData['funding_programme'] = funding_programme;
    }
    res.json(allData);
  });

router.route('/european-projects/funding_programme')
  .get((req, res) => {
    const iso2 = req.query.country_code || 'FR';
    res.json(funding_programme.filter((item) =>
      item.country_code.toLowerCase() === iso2.toLowerCase())
    );
  });

router.route('/european-projects/fr-esr-all-projects-synthese')
  .get((req, res) => {

    db.collection('EP-fr-esr-all-projects-synthese').distinct("stage").then((data) => {
      res.json(data);
    });
  });

router.route('/european-projects/analysis-synthese-funding_programme')
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send('country_code is required');
      return;
    }
    if (!req.query.stage) {
      res.status(400).send('stage is required');
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }
    const data = await db.collection('EP-fr-esr-all-projects-synthese')
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
          }

        },
        { $sort: { total_funding: -1 } }
      ]).toArray();
    res.json(data);

  });

router.route('/european-projects/analysis-synthese-focus')
  .get(async (req, res) => {
    const dataSuccessful = await db.collection('EP-fr-esr-all-projects-synthese')
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
          }
        },
        {
          $group: {
            _id: null,
            total_fund_eur: { $sum: "$total_fund_eur" },
            total_involved: { $sum: "$total_involved" },
            total_coordination_number: { $sum: "$total_coordination_number" },
            countries: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 0,
            total_fund_eur: 1,
            total_involved: 1,
            total_coordination_number: 1,
            countries: 1,
          }
        }
      ]).toArray();

    const dataEvaluated = await db.collection('EP-fr-esr-all-projects-synthese')
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
          }
        },
        {
          $group: {
            _id: null,
            total_fund_eur: { $sum: "$total_fund_eur" },
            total_involved: { $sum: "$total_involved" },
            total_coordination_number: { $sum: "$total_coordination_number" },
            countries: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 0,
            total_fund_eur: 1,
            total_involved: 1,
            total_coordination_number: 1,
            countries: 1,
          }
        }
      ]).toArray();


    if (req.query.country_code) {
      res.json({
        successful: {
          total_fund_eur: dataSuccessful[0].total_fund_eur,
          total_involved: dataSuccessful[0].total_involved,
          total_coordination_number: dataSuccessful[0].total_coordination_number,
          countries: dataSuccessful[0].countries.filter((el) => el.country_code.toLowerCase() === req.query.country_code.toLowerCase())
        },
        evaluated: {
          total_fund_eur: dataEvaluated[0].total_fund_eur,
          total_involved: dataEvaluated[0].total_involved,
          total_coordination_number: dataEvaluated[0].total_coordination_number,
          countries: dataEvaluated[0].countries.filter((el) => el.country_code.toLowerCase() === req.query.country_code.toLowerCase())
        },
      })
    }
    res.json({
      successful: dataSuccessful[0],
      evaluated: dataEvaluated[0],
    });
  });

router.route('/european-projects/analysis-synthese-projects-types-1')
  .get(async (req, res) => {
    if (!req.query.country_code) {
      res.status(400).send('country_code is required');
      return;
    }
    if (req.query.country_code) {
      req.query.country_code = req.query.country_code.toUpperCase();
    }
    const data = await db.collection('EP-fr-esr-all-projects-synthese')
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
          }
        },
        {
          $group: {
            _id: {
              id: "$action_id",
              name: "$action_name",
            },
            total_successful: { $sum: { $cond: [{ $eq: ["$stage", "successful"] }, "$total_fund_eur", 0] } },
            total_evaluated: { $sum: { $cond: [{ $eq: ["$stage", "evaluated"] }, "$total_fund_eur", 0] } },
          }
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            total_successful: 1,
            total_evaluated: 1,
          }
        },
        { $sort: { id: 1 } }
      ]).toArray();

    // remove empty data
    const ret = [];
    data.forEach((el) => {
      if (el.total_successful > 0 || el.total_evaluated > 0) {
        ret.push(el)
      }
    });

    return res.json(ret)
  });

router.route('/european-projects/template')
  .get(async (req, res) => {
    return res.json([])
  });

export default router;
