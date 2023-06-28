import express from 'express';
import helloRouter from './routes/hello';
import initRouter from './routes/init';
import elementsRouter from './routes/elements';

const router = new express.Router();

router.use(helloRouter);
router.use(initRouter);
router.use(elementsRouter);

export default router;
