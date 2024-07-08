var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { SOLANA_RPC_ENDPOINT, connection, quartzKeypair } from "./enviroment.js";
import { delay, getTransaction } from "./utils.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, TokenInvalidMintError, TokenInvalidOwnerError, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
export const sendTransactionLogic = (tx) => __awaiter(void 0, void 0, void 0, function* () {
    const DELAY = 1000;
    const MAX_WAIT = 60000;
    let sx = "";
    let processed = false;
    console.log("Sending tx...", sx);
    for (let i = 0; i < MAX_WAIT; i += DELAY) {
        try {
            sx = yield connection.sendRawTransaction(tx.serialize(), { maxRetries: 0, skipPreflight: true });
        }
        catch (error) {
            if (error.transactionMessage == 'Transaction simulation failed: This transaction has already been processed') {
                console.log("Transaction was already processed");
                processed = true;
            }
            else if (error.transactionMessage == "Transaction simulation failed: Blockhash not found") {
                console.log("Transaction expired: have to retry");
                return "";
            }
            else {
                console.log("Send transaction error: ", error);
            }
        }
        let status;
        status = yield getTransaction(sx, SOLANA_RPC_ENDPOINT);
        //Transaction accepted
        if (status.result != null) {
            if ('Ok' in status.result.meta.status) {
                console.log(`${sx} transaction CONFIRMED!!`);
                return sx;
            }
            else {
                console.log(`${sx} transaction FAILED`);
                return "";
            }
        }
        yield delay(DELAY);
    }
    console.log("Transaction timed out.");
    return "";
});
export const getATAOrInstruction = (mint, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const associatedToken = getAssociatedTokenAddressSync(mint, owner, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    let account;
    try {
        account = yield getAccount(connection, associatedToken, "finalized", TOKEN_PROGRAM_ID);
    }
    catch (error) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
            const instruction = createAssociatedTokenAccountInstruction(quartzKeypair.publicKey, associatedToken, owner, mint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
            return { address: associatedToken, instruction: instruction };
        }
        else {
            throw error;
        }
    }
    if (!account.mint.equals(mint))
        throw new TokenInvalidMintError();
    if (!account.owner.equals(owner))
        throw new TokenInvalidOwnerError();
    return { address: associatedToken, instruction: undefined };
});
export const instructionsIntoV0 = (txInstructions, signer, lookupTables) => __awaiter(void 0, void 0, void 0, function* () {
    let blockhash = yield connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: signer.publicKey,
        recentBlockhash: blockhash.blockhash,
        instructions: txInstructions,
    }).compileToV0Message(lookupTables);
    const transaction = new VersionedTransaction(messageV0);
    // sign your transaction with the required `Signers`
    transaction.sign([signer]);
    return transaction;
});
