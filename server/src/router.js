import express from "express";

import adminRouter from "./routes/admin/index.js";
import atlasRouter from "./routes/tableaux/atlas/index.js";
import elasticSearchRouter from "./routes/elasticsearch.js";
import europeanProjectsRouter from "./routes/tableaux/european-projects/index.js";
import initRouter from "./routes/init.js";
import searchRouter from "./routes/search.js";
import tableauxRouter from "./routes/tableaux.js";
import contactRouter from "./routes/contact.js";

const router = new express.Router();

router.use(adminRouter);
router.use(atlasRouter);
router.use(contactRouter);
router.use(elasticSearchRouter);
router.use(europeanProjectsRouter);
router.use(initRouter);
router.use(searchRouter);
router.use(tableauxRouter);

export default router;
