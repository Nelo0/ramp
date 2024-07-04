import WebSocket from "ws";
import { getBalanceChange, getSignaturesForAddress, getTransaction } from "./utils/utils.js";
import { TransactionInfo, getSwapIntructions as getSwapTransactionInfo } from "./offramp/swap.js";
import { ENV, SOLANA_RPC_ENDPOINT, SOLANA_WS_ENDPOINT, quartzKeypair } from "./utils/enviroment.js";
import { filterProcessedSignaturesNew } from "./utils/processing.js";
import { sendTransactionLogic } from "./utils/transactionSender.js";
import { returnFunds } from "./offramp/returnFunds.js";
import { PublicKey } from "@solana/web3.js";
import { getMockOfframpInfo } from "./offramp/mockOfframp.js";
import { addSignatures, getUsersAddressArray } from "./database/schema.js";
import express, { Application, Request, Response } from 'express';
import routes from "./routes/index.js";

const app: Application = express();
const port: number = 3001;

// Create a WebSocket connection
export const openHeliusWs = () => {
    const heliusSocket = new WebSocket(SOLANA_WS_ENDPOINT);
    const quartzDepositAddress = quartzKeypair.publicKey.toBase58()

    console.log("Quartz Deposit Address:", quartzDepositAddress)
    heliusSocket.onopen = () => {
        console.log('WebSocket is open');
        const request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "accountSubscribe",
            "params": [
                `${quartzDepositAddress}`,
                {
                    "encoding": "jsonParsed",
                    "commitment": "finalized"
                }
            ]
        }
        heliusSocket.send(JSON.stringify(request));
    }

    heliusSocket.onmessage = async ({ data }: any) => {
        const messageStr = data.toString('utf8');
        console.log("Detected a new transaction")

        //get txIDs for past trasnactions
        const prevTransactionData = await getSignaturesForAddress(quartzDepositAddress, SOLANA_RPC_ENDPOINT);
        const signatureObjects = prevTransactionData.result;

        //filter out the signatures that are already processed
        let signatures = await filterProcessedSignaturesNew(signatureObjects);
        //Get user address list
        const quartz_user_addresses = await getUsersAddressArray();

        console.log("New signatures to process: ", signatures);

        for (const signature of signatures) {
            const response = await getTransaction(signature, SOLANA_RPC_ENDPOINT);
            const transaction = response.result;

            const depositAmount = getBalanceChange(transaction);
            if (depositAmount <= 0) {
                //No amount deposited or users deposit transaction failed, store tx as processed
                await addSignatures([signature]);
                continue
            }

            const accountKeys = transaction.transaction.message.accountKeys;
            const userAddress = accountKeys[0]

            //check if the depositor is NOT a quartz user;
            if (quartz_user_addresses.includes(userAddress)) {
                if (userAddress == quartzDepositAddress) {
                    console.log("Quartz sent this transaction, dont process it more")
                    await addSignatures([signature]);

                } else {
                    //if not sent by quartz
                    console.log("Neither Quartz or a Quartz user sent this transaction, sending funds back to sender")
                    const result = await returnFunds(new PublicKey(userAddress), depositAmount, false)
                    if (!result) {
                        console.log(`Failed to return ${depositAmount} to sender ${userAddress}`)
                    } else {
                        await addSignatures([signature]);

                    }
                }
                continue
            }

            let transactionInfo: TransactionInfo;
            if (ENV === "devnet") {
                transactionInfo = await getMockOfframpInfo(depositAmount);
            } else {
                transactionInfo = await getSwapTransactionInfo(depositAmount);
            }
            const offrampTransaction = transactionInfo.transaction
            offrampTransaction.sign([quartzKeypair])
            console.log("sending Offramp transaction")
            let txId;
            try {
                txId = await sendTransactionLogic(offrampTransaction)
            } catch (error) {
                console.log("Send offramp transaction error: ", error);
            }
            if (txId == "") {
                console.log("Transaction failed")
                continue;
            }
            if (txId == undefined || txId == null) {
                //Dont store to database, this means that next time the server runs it will retry the offramp transaction since it will think that its a new unprocessed trasnaction 
                console.log("Transaction did not get accepted to the blockchain, not storing signature to database")
                continue;
            }

            console.log("Offramp transaction SUCCESS!, adding txId for deposit and offramp to processed transactions to database")
            //add txId to database
            await addSignatures([signature, txId]);

        }
    };

    heliusSocket.on('close', (code: number, reason: string) => {
        console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });

    heliusSocket.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
    });

    return heliusSocket
}

let socket = openHeliusWs();

app.use(express.json());
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});