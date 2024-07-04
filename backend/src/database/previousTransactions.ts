import { Status, TransactionData } from "../types/index.js";
import sql from "./supabase.js";

export const getUsersTransactionsArray = async (userAddress: string) => {
    console.log("getting user addresses: ")

    try {
        const usersTxData = await sql`
SELECT 
    t.offramp, t.input_currency, t.output_currency, 
    t.amount_input_currency, t.amount_output_currency, t.time, 
    t.gas_fee_euro, t.transaction_fee_euro, t.iban, t.bic, 
    t.transaction_hash, t.deposit_hash, t.status
FROM 
    transaction_data t
JOIN 
    users u ON t.user_id = u.user_id
WHERE 
    u.wallet_address = 'GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf'
ORDER BY 
    t.time DESC;
        `

        if (usersTxData == undefined) {
            throw Error("Database call to get user transactions data retuned undefined")
        }
        const transactions: TransactionData[] = usersTxData.map((tx: any) => ({
            offRamp: tx.offramp,
            inputCurrency: tx.input_currency,
            outputCurrency: tx.output_currency,
            amountInputCurrency: parseFloat(tx.amount_input_currency),
            amountOutputCurrency: parseFloat(tx.amount_output_currency),
            time: new Date(tx.time),
            gasFeeEuro: parseFloat(tx.gas_fee_euro),
            transactionFeeEuro: parseFloat(tx.transaction_fee_euro),
            iban: tx.iban,
            bic: tx.bic,
            transactionHash: tx.transaction_hash,
            depositHash: tx.deposit_hash,
            status: tx.status as Status
        }));

        return transactions

    } catch (error) {
        console.log("error getting user transactions data: ", error)
        throw Error("Error getting the user transactions data")
    }
}