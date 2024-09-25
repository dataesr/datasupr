import express from "express";

import overviewRoutes from "./routes/general/overview.js";
import positioningRoutes from "./routes/general/positioning.js";
import projectstypesRoutes from "./routes/general/projects-types.js";

const router = new express.Router();

router.use(overviewRoutes);
router.use(positioningRoutes);
router.use(projectstypesRoutes);

export default router;
