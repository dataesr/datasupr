import express from "express";

import tests from "./routes/tests.js";

const router = new express.Router();

router.use(tests);

export default router;
