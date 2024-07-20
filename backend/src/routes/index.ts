import { Router } from 'express';
import txHistoryRouter from './txHistory.js';
import customerRouter from './customer.js';

const router = Router();

router.use('/txHistory', txHistoryRouter);

router.use('/customer', customerRouter);

export default router;
