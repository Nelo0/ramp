import { Router, Request, Response } from 'express';
import cors from 'cors';
import { getKycLink, KycLinkInfo } from '../bridge/customer.js';
import { createLiquidationAddress, getLiqAddressHistory, LiquidationHistoryInfo } from '../bridge/liquidationAddress.js';
import { createExternalAccount, ExternalAccountInfo, getUsersExternalAccounts } from '../bridge/externalAccount.js';

const customerRouter = Router();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'POST',
    allowedHeaders: ["Content-Type"]
};
customerRouter.use(cors(corsOptions));

customerRouter.post('/createNewUser', async (req: Request, res: Response) => {
    try {
        const data: KycLinkInfo = req.body;

        const result = await getKycLink(data)

        const kycLink = result.kyc_link;
        const tosLink = result.tos_link;

        if (kycLink === undefined) {
            res.json({ error: "Could not get the KYC link, please try again later" })
            return
        }
        if (tosLink === undefined) {
            res.json({ error: "Could not get the Terms of Service link, please try again later" })
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

customerRouter.post('/createExternalAccount', async (req: Request, res: Response) => {
    try {
        const data: ExternalAccountInfo = req.body;

        const result: any = await createExternalAccount(data)

        const externalAccountId = result.id;
        if (!externalAccountId) {
            res.json({ error: "Could not create the external account, please try again later" })
            return
        }

        res.json({
            externalAccountId: externalAccountId,
        });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

customerRouter.post('/getExternalAccounts', async (req: Request, res: Response) => {
    try {
        const data: ExternalAccountInfo = req.body;

        const result: any = await getUsersExternalAccounts(data)

        const externalAccounts = result.data;
        if (!externalAccounts) {
            res.json({ error: "Could not get the users external accounts, please try again later" })
            return
        }

        res.json({
            externalAccounts: externalAccounts,
        });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

customerRouter.post('/createNewLiqAddress', async (req: Request, res: Response) => {
    try {
        const data: LiquidationHistoryInfo = req.body;

        const result: any = await createLiquidationAddress(data)

        //Docs are confusing, could be .address or .destination_address
        const liqAddress = result.address;
        if (!liqAddress) {
            res.json({ error: "Could not create a liquidiation address, please try again later" })
            return
        }

        res.json({
            liquidationAddress: liqAddress,
        });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


customerRouter.post('/getLiqAddressHistory', async (req: Request, res: Response) => {
    try {
        const data: LiquidationHistoryInfo = req.body;

        const result: any = await getLiqAddressHistory(data)

        const transactions = result.data;
        if (!transactions) {
            res.json({ error: "Could not get the list of previous transactions, please try again later" })
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