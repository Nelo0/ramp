import { Keypair, PublicKey } from "@solana/web3.js";
import { connection, quartzKeypair } from "./enviroment.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createMint, getAssociatedTokenAddressSync } from "@solana/spl-token";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function convertTo18Decimals(amount: number): bigint {
    const factor = BigInt(10 ** 18);
    return BigInt(amount) * factor;
}

export const convertDecimalPlaces = (amount: number, currentDecimalPlaces: number, targetDecimalPlaces: number) => {
    const factor = Math.pow(10, targetDecimalPlaces - currentDecimalPlaces);
    return amount * factor;
}

export const formatAmountForEuroe = (originalNumber: number) => {
    const decimalNumber = originalNumber * 1e-6;
    
    const roundedDownDecimal = Math.floor(decimalNumber * 100) / 100;
    
    const roundedDown18point = roundedDownDecimal * 1e18;
    
    return roundedDown18point;
}

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
                    "limit": 5
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

//create mint 
const createTokenMint = async (wallet: Keypair) => {
    let mintPubkey = await createMint(
        connection, // conneciton
        wallet, // fee payer
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
        6 // decimals
    );

    return mintPubkey;
}

//create ata for an address
export const createATAForAddress = async (tokenMint: PublicKey, address: PublicKey) => {

    const associatedToken = getAssociatedTokenAddressSync(tokenMint, address, undefined, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    console.log("assocaited token: ", associatedToken.toBase58())

    const instruction = createAssociatedTokenAccountInstruction(
        quartzKeypair.publicKey,
        associatedToken,
        address,
        tokenMint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    )

    return instruction;
}

export const getBalanceChange = (transactionResponse: any) => {
    const status = transactionResponse.meta.status
    if ('Error' in status) {
        console.log("Transaction failed")
        return 0
    }
    //TODO check if the sender is the one that is losing / sending the correct amount of funds that we are recieving.

    const index: number = transactionResponse.transaction.message.accountKeys.indexOf(quartzKeypair.publicKey.toBase58())
    const preBalance: number = transactionResponse.meta.preBalances[index]
    const postBalance: number = transactionResponse.meta.postBalances[index]

    const balanceChange = postBalance - preBalance;
    console.log(`pre balance : ${preBalance}, post balance: ${postBalance}`)
    console.log(`balance change: `, balanceChange)

    return balanceChange
}

export const formartToUi = (amount: number, decimals: number) => {
    const adjustedNumber = amount / Math.pow(10, decimals);

    const formattedNumber = adjustedNumber.toFixed(decimals);

    return formattedNumber;
}

export function convertAndRoundNumberToInteger(number: number): number {
    // Step 1: Convert the integer representation to the actual decimal number
    const actualNumber = number / 1000000;
  
    // Step 2: Round the number to 2 decimal places
    const roundedNumber = Math.floor(actualNumber * 100) / 100;
  
    // Step 3: Convert the rounded decimal number back to an integer representation with 6 decimal places
    const integerRepresentation = Math.floor(roundedNumber * 1000000);
  
    return integerRepresentation;
  }