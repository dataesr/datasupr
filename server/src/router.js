import express from 'express';
import helloRouter from './routes/hello';
import initRouter from './routes/init';
import elementsRouter from './routes/elements';
import searchRouter from './routes/search';
import tableauxRouter from './routes/tableaux';

const router = new express.Router();

router.use(helloRouter);
router.use(initRouter);
router.use(elementsRouter);
router.use(searchRouter);
router.use(tableauxRouter);

export default router;
