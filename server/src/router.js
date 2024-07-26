import express from "express";

import adminRouter from "./routes/admin";
import atlasRouter from "./routes/tableaux/atlas";
import elasticSearchRouter from "./routes/elasticsearch";
import europeanProjectsRouter from "./routes/tableaux/european-projects";
import initRouter from "./routes/init";
import searchRouter from "./routes/search";
import tableauxRouter from "./routes/tableaux";

const router = new express.Router();

router.use(adminRouter);
router.use(atlasRouter);
router.use(elasticSearchRouter);
router.use(europeanProjectsRouter);
router.use(initRouter);
router.use(searchRouter);
router.use(tableauxRouter);

export default router;
