import express from 'express';
import initRouter from './routes/init';
import searchRouter from './routes/search';
import tableauxRouter from './routes/tableaux';
import europeanProjectsRouter from './routes/tableaux/european-projects';
import atlasRouter from './routes/tableaux/atlas';

const router = new express.Router();

router.use(atlasRouter);
router.use(europeanProjectsRouter);
router.use(initRouter);
router.use(searchRouter);
router.use(tableauxRouter);

export default router;
