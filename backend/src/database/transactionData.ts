import { EditTransactionDataDb, Status, TransactionData, TransactionDataDb, User } from "../types/index.js";
import { formartToUi } from "../utils/utils.js";
import sql from "./supabase.js";

export const getUsersTransactionsArray = async (userAddress: string) => {
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
                u.wallet_address = ${userAddress}
            ORDER BY 
                t.time DESC;
        `;

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
        throw Error("Error getting the user transactions data")  // TODO - Fix throwing an error in a catch block?
    }
}


export const addTransactionData = async (values: TransactionDataDb) => {
    const { offramp, status, txHash, depositHash, amountInput, amountOutput, gasFee, txFee } = values;

    if (offramp === undefined || status === undefined || txHash === undefined || depositHash === undefined || amountInput === undefined ||
        amountOutput === undefined || gasFee === undefined || txFee === undefined) {
        console.error("Could bot add Transaction data to database:  One or more required fields are undefined");
        throw new Error("Could bot add Transaction data to databse: One or more required fields are undefined");
    }

    console.log("Adding transaction data to database...")
    const solPriceEur = await getSolPriceInFiat("eur");
    const user = await getUserByEmail("GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf");
    const amountInputUi = formartToUi(amountInput, 9)
    const amountOutputUi = formartToUi(amountOutput, 6)
    const gasFeeEuroUi = formartToUi(gasFee * solPriceEur, 6)
    const rampFeeEuroUi = formartToUi(txFee * solPriceEur, 6)

    console.log("amount input", amountInputUi)
    console.log("amount output", amountOutputUi)
    console.log("gasFeeEuro", gasFeeEuroUi)
    console.log("rampFeeEuro", rampFeeEuroUi)

    try {
        const txIdRow = await sql`
INSERT INTO transaction_data (
    user_id, offramp, input_currency, output_currency, amount_input_currency, 
    amount_output_currency, gas_fee_euro, transaction_fee_euro, 
    iban, bic, transaction_hash, deposit_hash, status
) VALUES (
    ${user.user_id}, ${offramp}, 'SOL', 'EUR', ${amountInputUi}, ${amountOutputUi}, ${gasFeeEuroUi}, ${rampFeeEuroUi}, 
    ${user.iban}, ${user.bic}, 
    ${txHash}, ${depositHash}, ${status}
) RETURNING transaction_id;;
        `;
        console.log("Signature added successfully");

        const txId: number[] = txIdRow.map((tx: any) => (tx.transaction_id));
        return txId[0];
    } catch (error) {
        console.error("Error adding signature: ", error);
    }
    throw new Error("Error adding signatures to database")
}

export const updateTransactionData = async (newValues: TransactionDataDb) => {
    const { txId, offramp, status, txHash, depositHash, amountInput, amountOutput, gasFee, txFee } = newValues;

    if (txId === undefined) {
        console.log("No transaciton Id present, can't update transaction data.")
        return
    };

    const solPriceEur = await getSolPriceInFiat("eur");
    const amountInputUi = amountInput !== undefined ? formartToUi(amountInput, 9) : undefined;
    const amountOutputUi = amountOutput !== undefined ? formartToUi(amountOutput, 6) : undefined;
    const gasFeeEuroUi = gasFee !== undefined ? formartToUi(gasFee * solPriceEur, 6) : undefined;
    const rampFeeEuroUi = txFee !== undefined ? formartToUi(txFee * solPriceEur, 6) : undefined;

    // Construct dynamic SET clause
    const columns = [];
    if (offramp !== undefined) columns.push('offramp');
    if (amountInputUi !== undefined) columns.push('amount_input_currency');
    if (amountOutputUi !== undefined) columns.push('amount_output_currency');
    if (gasFeeEuroUi !== undefined) columns.push('gas_fee_euro');
    if (rampFeeEuroUi !== undefined) columns.push('transaction_fee_euro');
    if (txHash !== undefined) columns.push('transaction_hash');
    if (depositHash !== undefined) columns.push('deposit_hash');
    if (status !== undefined) columns.push('status');

    if (columns.length === 0) {
        console.log("No fields to update");
        return;
    }

    const newObject: EditTransactionDataDb = {
        offramp: offramp!,
        amount_input_currency: amountInputUi!,
        amount_output_currency: amountOutputUi!,
        gas_fee_euro: gasFeeEuroUi!,
        transaction_fee_euro: rampFeeEuroUi!,
        transaction_hash: txHash!,
        deposit_hash: depositHash!,
        status: status!,
    }

    try {
        //@ts-ignore
        await sql` UPDATE transaction_data SET ${sql<[newObj?]>(newObject, columns)}
  where transaction_id = ${txId}
`
    } catch (error) {
        console.error("Error editing transaction", txId, error);
    }
}


const getSolPriceInFiat = async (fiat: string) => {

    //fiat in lowercase iso3 format eg. eur for euro
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=${fiat}`;

    const options: RequestInit = {
        method: 'GET'
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const price = data.solana[fiat];
        return price
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to fetch user by email
async function getUserByEmail(wallet_address: string): Promise<User> {
    const result = await sql`
    SELECT 
        user_id, email, wallet_address, created_at, iban, bic
    FROM 
        users
    WHERE 
        wallet_address = ${wallet_address}
    LIMIT 1;
    `;

    // Check if a user was found
    if (result.length === 0 || result == undefined) {
        throw new Error("Could not find user in database");
    }

    const user = result[0];
    return {
        user_id: user.user_id,
        email: user.email,
        wallet_address: user.wallet_address,
        created_at: new Date(user.created_at),
        iban: user.iban,
        bic: user.bic
    };
}