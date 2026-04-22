import express from "express";

import fluxRoutes from "./routes/flux.js";
import plusHautDiplomeRoutes from "./routes/plus-haut-diplome.js";
import repartitionRoutes from "./routes/repartition.js";

const router = new express.Router();

router.use(fluxRoutes);
router.use(plusHautDiplomeRoutes);
router.use(repartitionRoutes);

export default router;
