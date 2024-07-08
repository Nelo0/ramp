var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connection, quartzKeypair } from "./enviroment.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createMint, getAssociatedTokenAddressSync } from "@solana/spl-token";
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export function convertTo18Decimals(amount) {
    const factor = BigInt(10 ** 18);
    return BigInt(amount) * factor;
}
export const convertDecimalPlaces = (amount, currentDecimalPlaces, targetDecimalPlaces) => {
    const factor = Math.pow(10, targetDecimalPlaces - currentDecimalPlaces);
    return amount * factor;
};
export const formatAmountForEuroe = (originalNumber) => {
    const decimalNumber = originalNumber * 1e-6;
    const roundedDownDecimal = Math.floor(decimalNumber * 100) / 100;
    const roundedDown18point = roundedDownDecimal * 1e18;
    return roundedDown18point;
};
export const getSignaturesForAddress = (address, rpcUrl) => __awaiter(void 0, void 0, void 0, function* () {
    // Wait for 2 seconds
    yield delay(2000);
    // Fetch the response
    const response = yield fetch(rpcUrl, {
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
});
export const getTransaction = (signature, rpcUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(rpcUrl, {
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
        }),
    });
    return response.json();
});
//create mint 
const createTokenMint = (wallet) => __awaiter(void 0, void 0, void 0, function* () {
    let mintPubkey = yield createMint(connection, // conneciton
    wallet, // fee payer
    wallet.publicKey, // mint authority
    wallet.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    6 // decimals
    );
    return mintPubkey;
});
//create ata for an address
export const createATAForAddress = (tokenMint, address) => __awaiter(void 0, void 0, void 0, function* () {
    const associatedToken = getAssociatedTokenAddressSync(tokenMint, address, undefined, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    console.log("assocaited token: ", associatedToken.toBase58());
    const instruction = createAssociatedTokenAccountInstruction(quartzKeypair.publicKey, associatedToken, address, tokenMint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    return instruction;
});
export const getBalanceChange = (transactionResponse) => {
    const status = transactionResponse.meta.status;
    if ('Error' in status) {
        console.log("Transaction failed");
        return 0;
    }
    //TODO check if the sender is the one that is losing / sending the correct amount of funds that we are recieving.
    const index = transactionResponse.transaction.message.accountKeys.indexOf(quartzKeypair.publicKey.toBase58());
    const preBalance = transactionResponse.meta.preBalances[index];
    const postBalance = transactionResponse.meta.postBalances[index];
    const balanceChange = postBalance - preBalance;
    console.log(`pre balance : ${preBalance}, post balance: ${postBalance}`);
    console.log(`balance change: `, balanceChange);
    return balanceChange;
};
