import express from "express";

import filtersRoutes from "./routes/filters.js";
import overviewRoutes from "./routes/overview.js";
import positioningRoutes from "./routes/positioning.js";
import projectstypesRoutes from "./routes/projects-types.js";
import beneficiariesRoutes from "./routes/beneficiaries.js";

const router = new express.Router();

router.use(filtersRoutes);
router.use(overviewRoutes);
router.use(positioningRoutes);
router.use(projectstypesRoutes);
router.use(beneficiariesRoutes);

export default router;
