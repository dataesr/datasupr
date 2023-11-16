import express from "express";
import { db, client } from "../../../services/mongo";

const router = new express.Router();
// db.collection('atlas2023').find(req.query, { projection: { "effectif": 1 } }).toArray().then((data) => {

router.route('/atlas/number-of-students-map')
    .get((req, res) => {
        const allData = {};
        db.collection('atlas2023').find(req.query).toArray().then((data) => {
            allData.data = data.map((item) => ({
                effectif: item.effectif,
                geo_id: item.geo_id,
                geo_nom: item.geo_nom,
                sexe: item.sexe,
                secteur: item.secteur,
                secret: item.secret,
            }));
            res.json(allData);
        });
        console.log(req.query);
    });

export default router;
