import express from "express";
import facultyMembersGeoRouter from "./data/geo/overview.js";
import facultyMembersFieldsRouter from "./data/fields/overview.js";
import facultyMembersUniversityRouter from "./data/university/overview.js";

const router = new express.Router();

router.use(facultyMembersGeoRouter);
router.use(facultyMembersFieldsRouter);
router.use(facultyMembersUniversityRouter);

export default router;
