import { getProcessedSignatures } from "../database/schema.js";
import { Status, TransactionData } from "../types/index.js";

export const getPastTxObjects = async (address: string) => {
    const txObjects = []

    const processedSigs = await getProcessedSignatures(10); 
    if (processedSigs == undefined) {
        throw Error("Database call to get processed signatures retuned undefined")
    }
    const sigArray: string[] =  processedSigs.map(row => row.signature); // Map over the rows to extract the signatures
 
    for (const sig of sigArray) {
        txObjects.push({
            offRamp: true,
            inputCurrency: "SOL",
            outputCurrency: "EUR",
            amountInputCurrency: 120,
            amountOutputCurrency: 215.22,
            time: new Date(),
            gasFeeEuro: 0.21,
            transactionFeeEuro: 1.08,
            iban: "IE29AIBK93115212345678",
            bic: "AIBKIE2D",
            transactionHash: sig,
            depositHash: "signature here",
            status: Status.SUCCESS
        } as TransactionData)
    }
    return  txObjects
}