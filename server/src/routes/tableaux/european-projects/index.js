import express from "express";

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
        console.log(req.query);

        res.json(allData);
    });

router.route('/european-projects/funding_programme')
    .get((req, res) => {
        const iso2 = req.query.country_code || 'FR';
        console.log(iso2);
        res.json(funding_programme.filter((item) =>
            item.country_code.toLowerCase() === iso2.toLowerCase())
        );
    });

export default router;
