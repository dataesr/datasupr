import express from 'express';
import elasticSearchRouter from './routes/elasticsearch';
import initRouter from './routes/init';
import searchRouter from './routes/search';
import tableauxRouter from './routes/tableaux';
import atlasRouter from './routes/tableaux/atlas';
import europeanProjectsRouter from './routes/tableaux/european-projects';

const router = new express.Router();

router.use(atlasRouter);
router.use(elasticSearchRouter);
router.use(europeanProjectsRouter);
router.use(initRouter);
router.use(searchRouter);
router.use(tableauxRouter);

export default router;
