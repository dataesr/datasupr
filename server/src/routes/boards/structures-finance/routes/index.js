import express from "express";
import filtersRoutes from "./filters.js";
import nationalRoutes from "./national.js";
import comparisonsRoutes from "./comparisons.js";
import etablissementsRoutes from "./etablissements.js";
import evolutionsRoutes from "./evolutions.js";
import faqRoutes from "./faq.js";
import definitionsRoutes from "./definitions.js";

const router = express.Router();

router.use(filtersRoutes);
router.use(nationalRoutes);
router.use(comparisonsRoutes);
router.use(etablissementsRoutes);
router.use(evolutionsRoutes);
router.use(faqRoutes);
router.use(definitionsRoutes);

export default router;
