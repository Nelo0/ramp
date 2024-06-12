import WebSocket from "ws";
import { sendAndConfirmTransaction } from "@solana/web3.js";
import { ENV, SOLANA_RPC_ENDPOINT, SOLANA_WS_ENDPOINT, addStringToJson, checkTransaction, getSignaturesForAddress, getTransaction, filterProcessedSignatures } from "./utils.js";
import { connection, quartzKeypair } from "./mockOfframp.js";
import { getMockOfframpTx } from "./mockOfframp.js";
import { getSwapIntructions } from "./swap.js";

// Create a WebSocket connection
const QUARTZ_USER_LIST = ["AmQmMCAZ1kMvBhvfCpdhD7y91Y99uQAWrrztEPdSsTZJ"]

export const openHeliusWs = () => {
    const heliusSocket = new WebSocket(SOLANA_WS_ENDPOINT);
    const senderAddress = quartzKeypair.publicKey.toBase58()

    heliusSocket.onopen = () => {
        console.log('WebSocket is open');
        const request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "accountSubscribe",
            "params": [
                "6sv5cX4U38aNs5KujEqTyNqDct5DmjAoZKZA4JN6fEJV",
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
        try {
            const messageObj = JSON.parse(messageStr);
            console.log("Detected a new transaction: ")
        }
        catch (error) {
            console.error('Failed to parse JSON:', error);

        }
        //get txIDs for past trasnactions
        const prevTransactionData = await getSignaturesForAddress(senderAddress, SOLANA_RPC_ENDPOINT);
        const signatureObjects = prevTransactionData.result;

        //filter out the signatures that are already processed
        let signatures = await filterProcessedSignatures(signatureObjects);

        if (signatures == undefined) {
            return;
        }
        console.log("Signatures to process: ", signatures);

        for (const signature of signatures) {
            const response = await getTransaction(signature, SOLANA_RPC_ENDPOINT);
            const transaction = response.result;

            const accountKeys = transaction.transaction.message.accountKeys;

            //check if the depositor is NOT a quartz user;
            if (!QUARTZ_USER_LIST.includes(accountKeys[0])) {
                //Check if the transaction ends up with the Quartz balance increasing.
                //TODO if yes -> return funds to user minus amount needed for sending the trasnaction
                //console.log("Sender of transaction: ", signature, " is not a Quartz user, sending deposit amount back")

                //else , probablly a transaction sent by Quartz
                if (accountKeys[0] == senderAddress) {
                    console.log("Quartz sent this transaction, dont process it more")
                } else {
                    //if not sent by quartz
                    console.log("Quartz did not send this transaction")
                }
                await addStringToJson(signature);
                continue
            }
            console.log("TxID", signature + " accountKeys: ", transaction.transaction.message.accountKeys);

            //get the deposit amount;
            const quartzPreBalance = transaction.meta.preBalances[1]
            const quartzPostBalance = transaction.meta.postBalances[1]
            const depositAmount = quartzPostBalance - quartzPreBalance

            if (depositAmount <= 0) {
                console.log("Transaction: ", signature, "processed")
                await addStringToJson(signature);
            }

            let offrampSolTransaction: any;
            let tokenUiAmount;
            if (ENV === "devnet") {
                offrampSolTransaction = getMockOfframpTx(depositAmount);
                tokenUiAmount = 1
            } else {
                offrampSolTransaction = getSwapIntructions(depositAmount);
                //TODO get the quote amount and store it in tokenUiAmount
                tokenUiAmount = 1
            }

            //check if the transaction was successful (swapping the correct amount and sending it to the stablecoin offramp address)
            //Addresses are sent the right amount of tokens
            //Store the transaction signature in a database (file for now)
            console.log("sending Offramp transaction")
            let txId;
            try {
                txId = await sendAndConfirmTransaction(connection, offrampSolTransaction, [quartzKeypair]);
            } catch (error) {
                console.log("Send offramp transaction error: ", error);
            }
            if (txId == undefined) {
                console.log("Offramp txId is undefined")
                //@ts-ignore
                console.log("Offramp Send transaction error logs: ", await error!.getLogs());
                continue;
            }
            console.log("offramp transaction signature: ", txId);

            console.log("Checking the status of the offramp transaction...")
            let offrampSuccess = await checkTransaction(txId, tokenUiAmount);
            console.log("offramp sucesss: ", offrampSuccess)

            if (!offrampSuccess) {
                console.log("Transaction did not deposit the expected amount, not storing in database")
                //Dont store to database, this means that next time the server runs it will retry the offramp transaction since it will think that its a new unprocessed trasnaction 
                continue;
            }

            console.log("Offramp transaction success, adding txId for deposit and offramp to processed transactions storage")
            //add txId to json file
            await addStringToJson(signature);
            await addStringToJson(txId);
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


//console.log("Keypair public : ", keypair.publicKey.toBase58())

let socket = openHeliusWs();