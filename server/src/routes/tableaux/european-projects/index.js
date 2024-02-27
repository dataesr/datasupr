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

export default router;
