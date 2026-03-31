import express from "express";
import facultyMembersStructuresFiltersRouter from "./data/structures/index.js";
import facultyMembersRegionsFiltersRouter from "./data/geo/index.js";
const router = new express.Router();

router.use(facultyMembersStructuresFiltersRouter);
router.use(facultyMembersRegionsFiltersRouter);

export default router;
