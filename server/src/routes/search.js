import express from "express";

const router = new express.Router();

const allData = [
  {
    label: "Université Paris-Saclay",
    active: true,
    id: "G2qA7",
    type: "structure",
  },
  {
    label: "CEA Paris-Saclay - Etablissement de Saclay",
    active: true,
    id: "hg15O",
    type: "structure",
  },
  {
    label: "Campus Paris Saclay",
    active: true,
    id: "APN3L",
    type: "structure",
  },
  {
    label: "France",
    id: "FRAFR",
    type: "country",
    iso3: "FRA",
    iso2: "FR",
  },
  {
    label: "Allemagne",
    id: "DEUDE",
    type: "country",
    iso3: "DEU",
    iso2: "DE",
  },
];

router.route('/search')
  .get((req, res) => {
    let data = [];
    if (req.query?.q) {
      data = allData.filter((el) => el.label.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1)
    }

    res.json(data);
  });

export default router;
