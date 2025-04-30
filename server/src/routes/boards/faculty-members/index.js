import express from "express";
import facultyMembersGeoRouter from "./data/geo/overview.js";
import facultyMembersFieldsRouter from "./data/fields/overview.js";
import facultyMembersFieldsByStatusRouter from "./data/fields/by-status.js";
import facultyMembersFieldsByUnivRouter from "./data/fields/by-univ.js";
import facultyMembersFieldsByAgeRouter from "./data/fields/by-age.js";
import facultyMembersFieldsEvolutionRouter from "./data/fields/evolution.js";
import facultyMembersUniversityRouter from "./data/university/overview.js";

const router = new express.Router();

router.use(facultyMembersGeoRouter);
router.use(facultyMembersFieldsRouter);
router.use(facultyMembersFieldsByStatusRouter);
router.use(facultyMembersFieldsByUnivRouter);
router.use(facultyMembersFieldsByAgeRouter);
router.use(facultyMembersUniversityRouter);
router.use(facultyMembersFieldsEvolutionRouter);

export default router;
