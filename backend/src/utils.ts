import { Cluster } from "@solana/web3.js";
import * as dotenv from "dotenv"
import { offrampDepositATA } from "./mockOfframp.js";
import * as fs from 'fs/promises';

dotenv.config();

interface JsonStructure {
    data: string[];
}

const HELIUS_APIKEY = process.env.HELIUS_APIKEY;
export const ENV: Cluster = (process.env.cluster as Cluster) || "mainnet-beta";
export const SOLANA_WS_ENDPOINT = ENV === "devnet"
    ? `wss://devnet.helius-rpc.com/?api-key=${HELIUS_APIKEY}`
    : `wss://mainnet.helius-rpc.com/?api-key=${HELIUS_APIKEY}`;

export const SOLANA_RPC_ENDPOINT = ENV === "devnet"
    ? `https://devnet.helius-rpc.com/?api-key=${HELIUS_APIKEY}`
    : `https://mainnet.helius-rpc.com/?api-key=${HELIUS_APIKEY}`;

export const getSignaturesForAddress = async (address: string, rpcUrl: string) => {
    // Wait for 2 seconds
    await delay(2000);

    // Fetch the response
    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getSignaturesForAddress",
            "params": [
                address,
                {
                    "limit": 2
                }
            ]
        }),
    });

    // Check if response is undefined
    if (!response) {
        console.log(`Couldn't find the previous transactions for the address ${address}`);
        return false;
    }

    // Return the JSON response
    return response.json();
};


export const getTransaction = async (signature: string, rpcUrl: string) => {

    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTransaction",
            "params": [
                signature,
                {
                    "encoding": "json",
                    "maxSupportedTransactionVersion": 0,
                    "commitment": "confirmed"
                },
            ]
        }
        ),
    });

    return response.json();
}


export const checkTransaction = async (txId: string, tokenAmount: number) => {
    let offrampTransactionResponse: any;

    await delay(2000);

    try {
        offrampTransactionResponse = await getTransaction(txId, SOLANA_RPC_ENDPOINT);
    } catch (error) {
        console.log("Error getting the transaction with txid: ", txId)
        return false
    }

    if (offrampTransactionResponse == undefined) {
        console.log("Offramp transaction with txid: ", txId, " was not found, offramp tx respoinse:  ", offrampTransactionResponse)
        return false;
    }

    const offrampTransactionResult = offrampTransactionResponse.result;
    const accountKeys = offrampTransactionResult.transaction.message.accountKeys;
    const indexOfStablecoinMintAddress = accountKeys.indexOf(offrampDepositATA.toBase58())
    const preTokenBalances = offrampTransactionResult.meta.preTokenBalances;
    const postTokenBalances = offrampTransactionResult.meta.postTokenBalances;

    const obj1 = preTokenBalances.find((balanceObj: any) => balanceObj.accountIndex === indexOfStablecoinMintAddress);
    const obj2 = postTokenBalances.find((balanceObj: any) => balanceObj.accountIndex === indexOfStablecoinMintAddress);
    const preAmount = obj1.uiTokenAmount.uiAmountString
    const postAmount = obj2.uiTokenAmount.uiAmountString

    console.log("Pre amount:" + preAmount, "post amount" + postAmount)

    const amountRecieved = postAmount - preAmount;

    if (amountRecieved == tokenAmount) {
        console.log("Correct amount recieved")
        return true;
    }
    console.log("Correct amount NOT recieved")
    return false;
}

//checkTransaction("33MQedFGFjmNpN1hahuysa4YG6mHAt6po3rZeBkcR5iveRxEEEDdZcrsCi83vhp6Gx6tMB2NfLC2tdHqsA8BhVGq", 2);

export async function addStringToJson(newString: string): Promise<void> {
    try {
        // Read the JSON file
        const fileContent = await fs.readFile("./data.json", 'utf8');
        const json: JsonStructure = JSON.parse(fileContent);

        // Check if 'data' property exists and is an array
        if (Array.isArray(json.data)) {
            json.data.push(newString);
        } else {
            throw new Error("'data' property is not an array");
        }

        // Write the updated JSON back to the file
        const updatedJson = JSON.stringify(json, null, 2);
        await fs.writeFile("./data.json", updatedJson, 'utf8');

        console.log(`Successfully added "${newString}" to the JSON file.`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
// Example usage
// const filePath = './data.json';
// const newString = '33MQedFGFjmNpN1hahuysa4YG6mHAt6po3rZeBkcR5iveRxEEEDdZcrsCi83vhp6Gx6tMB2NfLC2tdHqsA8BhVGq';
// addStringToJson(newString);

export const filterProcessedSignatures = async (signatureObjects: any) => {
    // Read the JSON file
    const fileContent = await fs.readFile("./data.json", 'utf8');
    const json: JsonStructure = JSON.parse(fileContent);
    let signatures = []

    // Check if 'data' property exists and is an array
    if (!Array.isArray(json.data)) {
        throw new Error("'data' property is not an array");
    }

    if (signatureObjects == undefined) {
        console.log("SignatureObjects array is empty")
        return;
    }
    for (const obj of signatureObjects) {
        const signature = obj.signature;
        const isInFile = json.data.includes(signature);
        if (!isInFile) {
            signatures.push(signature);
        } else {
            console.log("Signature already in file: ", signature);
        }
    }
    return signatures;
}


export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
