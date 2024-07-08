var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import cors from 'cors';
import { getPastTxObjects } from '../utils/transactionData.js';
const txHistoryRouter = Router();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'POST',
    allowedHeaders: ["Content-Type"]
};
txHistoryRouter.use(cors(corsOptions));
txHistoryRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address } = req.body;
        if (typeof address !== 'string') {
            return res.status(400).json({ error: 'Input must be a string' });
        }
        // Get the tx signatures
        const result = yield getPastTxObjects(address);
        res.json({ result });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
export default txHistoryRouter;
