import express from "express";

const router = new express.Router();

router.route("/search").get((req, res) => {
  console.log(req.query);
  res.json([
    {
      label: "Université Paris-Saclay",
      active: true,
      id: "G2qA7",
      type: "structure",
    },
    {
      label: "France",
      active: true,
      id: "FRA",
      type: "country",
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
  ]);
});

export default router;
