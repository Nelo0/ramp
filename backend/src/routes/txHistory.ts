import { Router, Request, Response } from 'express';
import { getUsersTransactionsArray } from '../database/previousTransactions.js';

const txHistoryRouter = Router();

txHistoryRouter.get('/', (req: Request, res: Response) => {
    res.send('Transaction history is here');
});

txHistoryRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { address } = req.body;

        if (typeof address !== 'string') {
            return res.status(400).json({ error: 'Input must be a string' });
        }

        // Get the tx signatures
        const result = await getUsersTransactionsArray(address);

        res.json({ result });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default txHistoryRouter;