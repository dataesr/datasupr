import express from "express";
import facultyMembersFieldsByAgeRouter from "./data/fields/by-age.js";
import facultyMembersFieldsByStatusRouter from "./data/fields/by-status.js";
import facultyMembersFieldsByUnivRouter from "./data/fields/by-univ.js";
import facultyMembersFieldsEvolutionRouter from "./data/fields/evolution.js";
import facultyMembersFieldsGenderRouter from "./data/fields/by-gender.js";
import facultyMembersFieldsResearchsTeachersRouter from "./data/fields/by-researchs-teachers.js";
import facultyMembersFieldsRouter from "./data/fields/overview.js";
import facultyMembersGeoRouter from "./data/geo/overview.js";
import facultyMembersUniversityRouter from "./data/university/overview.js";

const router = new express.Router();

router.use(facultyMembersFieldsByAgeRouter);
router.use(facultyMembersFieldsByStatusRouter);
router.use(facultyMembersFieldsByUnivRouter);
router.use(facultyMembersFieldsEvolutionRouter);
router.use(facultyMembersFieldsGenderRouter);
router.use(facultyMembersFieldsResearchsTeachersRouter);
router.use(facultyMembersFieldsRouter);
router.use(facultyMembersGeoRouter);
router.use(facultyMembersUniversityRouter);

export default router;
