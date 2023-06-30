import express from 'express';
import helloRouter from './routes/hello';
import initRouter from './routes/init';
import searchRouter from './routes/search';
import tableauxRouter from './routes/tableaux';
import europeanProjectsRouter from './routes/tableaux/european-projects';

const router = new express.Router();

router.use(helloRouter);
router.use(initRouter);
router.use(searchRouter);
router.use(tableauxRouter);
router.use(europeanProjectsRouter);

export default router;
