import { Router, Request, Response } from 'express';
import { getUsersTransactionsArray } from '../database/transactionData.js';
import cors from 'cors';

const txHistoryRouter = Router();

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'POST',          
    allowedHeaders: ["Content-Type"]
};
txHistoryRouter.use(cors(corsOptions));

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