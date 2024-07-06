import { Status, TransactionData, User } from "../types/index.js";
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
    u.wallet_address = 'GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf'
ORDER BY 
    t.time;
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


export const addTransactionData = async (offramp: boolean, status: string, tx_hash: string, deposit_hash: string, amountInput: number, amountOutput: number, gasFee: number, txFee: number) => {
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
        await sql`
INSERT INTO transaction_data (
    user_id, offramp, input_currency, output_currency, amount_input_currency, 
    amount_output_currency, gas_fee_euro, transaction_fee_euro, 
    iban, bic, transaction_hash, deposit_hash, status
) VALUES (
    ${user.user_id}, ${offramp}, 'SOL', 'EUR', ${amountInput}, ${amountOutput}, ${gasFeeEuroUi}, ${rampFeeEuroUi}, 
    ${user.iban}, ${user.bic}, 
    ${tx_hash}, ${deposit_hash}, ${status}
);
        `;
        console.log("Signatures added successfully");
    } catch (error) {
        console.error("Error adding signatures: ", error);
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

// async function main() {
//    //const solPriceEur = await getSolPriceInFiat("eur");
//    //const user = await getUserByEmail("GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf");
//    //console.log("User info: ", user)

//    //await addTransactionData(true, "SUCCESS", "3EEvzg5hfowGPhDHSwSGY4bmhPsreVtF8G44Xh6McmJHvoNsxCz7ti6CfTMHkkWJGDadSJ5SMZyy78Ke8UwXvSFs", "3EEvzg5hfowGPhDHSwSGY4bmhPsreVtF8G44Xh6McmJHvoNsxCz7ti6CfTMHkkWJGDadSJ5SMZyy78Ke8UwXvSFs", 0.0001, 0.01, 0.00001, 0)



// const x = formartToUi(10000, 6)

// console.log("x", x )
// }

//main()
//1132.423400000