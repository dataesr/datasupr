import express from "express";

import overviewRoutes from "./routes/general/overview.js";
import positioningRoutes from "./routes/general/positioning.js";
import projectstypesRoutes from "./routes/general/projects-types.js";
import beneficiariesRoutes from "./routes/general/beneficiaries.js";

const router = new express.Router();

router.use(overviewRoutes);
router.use(positioningRoutes);
router.use(projectstypesRoutes);
router.use(beneficiariesRoutes);

export default router;
