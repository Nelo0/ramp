import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { SOLANA_RPC_ENDPOINT, connection } from "./enviroment.js";
import { delay, getTransaction } from "./utils.js";

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