import express from "express";
import { checkQuery } from "../utils.js";
import { db } from "../../../../services/mongo.js";

const router = new express.Router();

router.route("/european-projects/beneficiaries/main-beneficiaries-pct-50").get(async (req, res) => {
  if (!req.query.country_code) {
    res.status(400).send("country_code is required");
    return;
  }

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

  filters.framework = "Horizon Europe";
  
  const data = await db
    .collection("ep_projects-entities_staging")
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

export default router;
