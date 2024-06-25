import { PublicKey, Signer, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { SOLANA_RPC_ENDPOINT, connection, quartzKeypair } from "./enviroment.js";
import { delay, getTransaction } from "./utils.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Account, TOKEN_PROGRAM_ID, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, TokenInvalidMintError, TokenInvalidOwnerError, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";

export const sendTransactionLogic = async (tx: VersionedTransaction | Transaction) => {

    const DELAY = 1_000;
    const MAX_WAIT = 60_000;

    let sx = ""
    let processed = false;

    console.log("Sending tx...", sx)
    for (let i = 0; i < MAX_WAIT; i += DELAY) {
        try {
            sx = await connection.sendRawTransaction(tx.serialize(), { maxRetries: 0, skipPreflight: true })
        } catch (error: any) {

            if (error.transactionMessage == 'Transaction simulation failed: This transaction has already been processed') {
                console.log("Transaction was already processed")
                processed = true
            } else if (error.transactionMessage == "Transaction simulation failed: Blockhash not found") {
                console.log("Transaction expired: have to retry")
                return ""
            } else {
                console.log("Send transaction error: ", error)
            }
        }
        let status;
        status = await getTransaction(sx, SOLANA_RPC_ENDPOINT);

        //Transaction accepted
        if (status.result != null) {
            if ('Ok' in status.result.meta.status) {
                console.log(`${sx} transaction CONFIRMED!!`)
                return sx
            } else {
                console.log(`${sx} transaction FAILED`)
                return ""
            }
        }

        await delay(DELAY)
    }

    console.log("Transaction timed out.")
    return "";
}

export const getOrCreateATA = async (mint: PublicKey, owner: PublicKey) => {
    const associatedToken = getAssociatedTokenAddressSync(mint, owner, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    let account: Account;
    try {
        account = await getAccount(connection, associatedToken, "finalized", TOKEN_PROGRAM_ID);
    } catch (error: unknown) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
            try {
                const instructions = [
                    createAssociatedTokenAccountInstruction(
                        quartzKeypair.publicKey,
                        associatedToken,
                        owner,
                        mint,
                        TOKEN_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    )
                ]
                const transaction = await instructionsIntoV0(instructions, quartzKeypair)
                const result = await sendTransactionLogic(transaction);

                if (result != "") {
                    console.log("Successfully created offramp ATA")
                } else {
                    console.log("Failed to create offramp ATA")
                    return
                }
            } catch (error: unknown) {
                // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
                // instruction error if the associated account exists already.
            }

            // Now this should always succeed
            account = await getAccount(connection, associatedToken, "finalized", TOKEN_PROGRAM_ID);
        } else {
            throw error;
        }
    }

    if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
    if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError();

    return account.address;
}

export const instructionsIntoV0 = async (txInstructions: TransactionInstruction[], signer: Signer) => {
    let blockhash = await connection.getLatestBlockhash()

    const messageV0 = new TransactionMessage({
        payerKey: signer.publicKey,
        recentBlockhash: blockhash.blockhash,
        instructions: txInstructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    // sign your transaction with the required `Signers`
    transaction.sign([signer]);

    return transaction;
}