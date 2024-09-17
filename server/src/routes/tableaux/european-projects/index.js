import express from "express";

import overviewRoutes from "./routes/general/overview";
import positioningRoutes from "./routes/general/positioning";
import projectstypesRoutes from "./routes/general/projects-types";

const router = new express.Router();

router.use(overviewRoutes);
router.use(positioningRoutes);
router.use(projectstypesRoutes);

export default router;
