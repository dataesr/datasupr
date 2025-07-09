import express from "express";
import facultyMembersYearsFiltersRouter from "./data/general/index.js";
import facultyMembersStructuresFiltersRouter from "./data/structures/index.js";
import facultyMembersRegionsFiltersRouter from "./data/geo/index.js";
import facultyMembersFieldsFiltersRouter from "./data/fields/index.js";
const router = new express.Router();

router.use(facultyMembersYearsFiltersRouter);
router.use(facultyMembersStructuresFiltersRouter);
router.use(facultyMembersRegionsFiltersRouter);
router.use(facultyMembersFieldsFiltersRouter);

export default router;
