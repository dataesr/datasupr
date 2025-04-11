import express from "express";
import facultyMembersRouter from "./data/geo/overview.js";

const router = new express.Router();

router.use(facultyMembersRouter);

export default router;
