import express from "express";

import financeRoutes from "./routes/index.js";

const router = new express.Router();

router.use(financeRoutes);

export default router;
