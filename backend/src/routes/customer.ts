import { Router, Request, Response } from 'express';
import cors from 'cors';
import { getKycLink, KycLinkInfo } from '../bridge/createCustomer.js';

const customerRouter = Router();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'POST',
    allowedHeaders: ["Content-Type"]
};
customerRouter.use(cors(corsOptions));

customerRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const data: KycLinkInfo = req.body;

        const result = await getKycLink(data)

        const kycLink = result.kyc_link;
        const tosLink = result.tos_link;

        if (kycLink === undefined) {
            res.json({ error: "Could not get the KYC link, please try again later"})
        }
        if (tosLink === undefined) {
            res.json({ error: "Could not get the Terms of Service link, please try again later"})
        }

        res.json({
            kyc_link: result.kyc_link,
            tos_link: result.tos_link
        });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default customerRouter;