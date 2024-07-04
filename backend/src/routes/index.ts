import { Router } from 'express';
import txHistoryRouter from './txHistory.js';

const router = Router();

router.use('/txHistory', txHistoryRouter);

export default router;
