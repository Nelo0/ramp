import { Router, Request, Response } from 'express';
import cors from 'cors';
import { getKycLink, KycLinkInfo } from '../bridge/customer.js';
import { getLiqAddressHistory, LiquidationHistoryInfo } from '../bridge/liquidationAddress.js';

const customerRouter = Router();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'POST',
    allowedHeaders: ["Content-Type"]
};
customerRouter.use(cors(corsOptions));

customerRouter.post('/createNew', async (req: Request, res: Response) => {
    try {
        const data: KycLinkInfo = req.body;

        const result = await getKycLink(data)

        const kycLink = result.kyc_link;
        const tosLink = result.tos_link;

        if (kycLink === undefined) {
            res.json({ error: "Could not get the KYC link, please try again later"})
            return
        }
        if (tosLink === undefined) {
            res.json({ error: "Could not get the Terms of Service link, please try again later"})
            return
        }

        res.json({
            kyc_link: kycLink,
            tos_link: tosLink
        });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//TODO: create a new liquidation address



customerRouter.post('/getLiqAddressHistory', async (req: Request, res: Response) => {
    try {
        const data: LiquidationHistoryInfo = req.body;

        const result: any = await getLiqAddressHistory(data)

        const transactions = result.data;
        if (!transactions) {
            res.json({ error: "Could not get the list of previous transactions, please try again later"})
            return
        }

        res.json({
            previousTransactions: transactions,
        });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default customerRouter;