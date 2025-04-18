import express from "express";
import facultyMembersGeoRouter from "./data/geo/overview.js";
import facultyMembersFieldsRouter from "./data/fields/overview.js";

const router = new express.Router();

router.use(facultyMembersGeoRouter);
router.use(facultyMembersFieldsRouter);

export default router;
