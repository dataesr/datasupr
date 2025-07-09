import express from "express";

import adminRouter from "./routes/admin/index.js";
import facultyMembersRouter from "./routes/boards/faculty-members/index.js";
import atlasRouter from "./routes/boards/atlas/index.js";
import elasticSearchRouter from "./routes/elasticsearch.js";
import europeanProjectsRouter from "./routes/boards/european-projects/index.js";
import initRouter from "./routes/init.js";
import searchRouter from "./routes/search.js";
import tableauxRouter from "./routes/tableaux.js";
import contactRouter from "./routes/contact.js";
import geoRouter from "./routes/geo.js";
import graduatesRouter from "./routes/boards/graduates/index.js";

const router = new express.Router();

router.use(adminRouter);
router.use(facultyMembersRouter);
router.use(atlasRouter);
router.use(contactRouter);
router.use(elasticSearchRouter);
router.use(europeanProjectsRouter);
router.use(initRouter);
router.use(searchRouter);
router.use(tableauxRouter);
router.use(geoRouter);
router.use(graduatesRouter);


export default router;
