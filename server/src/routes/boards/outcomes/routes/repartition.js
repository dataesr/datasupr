import express from "express";

const router = new express.Router();

router.route("/outcomes/repartition").get(async (req, res) => {
  return res.status(501).json({
    error:
      "La route répartition est en cours de migration vers une nouvelle source de données.",
  });
});

export default router;
