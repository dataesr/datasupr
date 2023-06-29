import express from "express";

const router = new express.Router();

router.route("/elements").get((req, res) => {
  console.log("req", req);
  if (req.body.id === "RechercheId") {
    res.json({
      content: [
        {
          conponent: "title",
          value: "Mon premier titre paramétré",
        },
        {
          component: "chart",
          id: "chartId1",
        },
      ],
    });
  }
});

export default router;
