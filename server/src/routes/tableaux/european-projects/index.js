import express from "express";

import evol_all_pc_coordination_EVAL from './data/evol_all_pc_coordination_EVAL.json' assert { type: "json" };
import evol_all_pc_coordination_SIGNED from './data/evol_all_pc_coordination_SIGNED.json' assert { type: "json" };

// import evol_all_pc_funding_EVAL from './data/evol_all_pc_funding_EVAL.json';
// import evol_all_pc_participant_EVAL from './data/evol_all_pc_participant_EVAL.json';
// import evol_all_pc_participant_SIGNED from './data/evol_all_pc_participant_SIGNED.json';
// import evol_all_pc_project_EVAL from './data/evol_all_pc_project_EVAL.json';
// import evol_all_pc_project_SIGNED from './data/evol_all_pc_project_SIGNED.json';
// import funding_participant_share_actions from './data/funding_participant_share_actions.json';
// import funding_programme from './data/funding_programme.json';

// import evol_all_pc_funding_SIGNED.json from './data/evol_all_pc_funding_SIGNED.json';


const router = new express.Router();

const allData = {};

router.route('/european-projects')
    .get((req, res) => {
        const allData = {};

        if (req.query.countryCode) {
            // filtre de toutes les data sur le pays
            allData['evol_all_pc_coordination_EVAL'] = evol_all_pc_coordination_EVAL.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());
            allData['evol_all_pc_coordination_SIGNED'] = evol_all_pc_coordination_SIGNED.data.filter((el) => el.country_code.toLowerCase() === req.query.countryCode.toLowerCase());

        } else {
            allData['evol_all_pc_coordination_EVAL'] = evol_all_pc_coordination_EVAL.data;
            allData['evol_all_pc_coordination_SIGNED'] = evol_all_pc_coordination_SIGNED.data;
        }
        console.log(req.query);

        res.json(allData);
    });

export default router;
