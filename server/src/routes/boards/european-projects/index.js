import express from "express";

import filtersRoutes from "./routes/filters.js";
import overviewRoutes from "./routes/overview.js";
import positioningRoutes from "./routes/positioning.js";
import collaborationsRoutes from "./routes/collaborations.js";
import projectstypesRoutes from "./routes/projects-types.js";
import beneficiariesRoutes from "./routes/beneficiaries.js";
import typeBeneficiariesRoutes from "./routes/type-beneficiaries.js";
import evolutionPcriRoutes from "./routes/evolution-pcri.js";

const router = new express.Router();

router.use(filtersRoutes);
router.use(overviewRoutes);
router.use(positioningRoutes);
router.use(collaborationsRoutes)
router.use(projectstypesRoutes);
router.use(beneficiariesRoutes);
router.use(typeBeneficiariesRoutes);
router.use(evolutionPcriRoutes);

export default router;
