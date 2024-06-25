import { ComputeBudgetProgram, PublicKey, SystemProgram, TransactionInstruction, VersionedMessage } from "@solana/web3.js";
import { connection, quartzKeypair } from "../utils/enviroment.js";
import { getSimulationComputeUnits } from "@solana-developers/helpers"
import { instructionsIntoV0, sendTransactionLogic } from "../utils/transactionSender.js";

export const returnFunds = async (toAddress: PublicKey, amount: number, splToken: boolean) => {

    let instructions: TransactionInstruction[];
    if (splToken) {
        //instructions = returnSpl();
        instructions = await returnLamportIx(toAddress, amount);

    } else {
        instructions = await returnLamportIx(toAddress, amount);

    }
    const transaction = await instructionsIntoV0(instructions, quartzKeypair)
    const sig = await sendTransactionLogic(transaction)

    if (sig == "") {
        console.log("There was an error sending back funds")
        return false;
    }

    return true;
}

const returnLamportIx = async (toAddress: PublicKey, amount: number) => {
    const defaultFee = 5000
    const computeUnits = 500
    const microLamports = 500_000

    const lamportsForFee = ((microLamports * computeUnits) / 1_000_000) + defaultFee

    const returnAmount = amount - lamportsForFee;
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnits
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 500_000
    });

    return [
        modifyComputeUnits,
        addPriorityFee,
        SystemProgram.transfer({
            fromPubkey: quartzKeypair.publicKey,
            toPubkey: toAddress,
            lamports: returnAmount,
        })
    ]
}

const returnSplIx = async () => {

}


const calculateFee = async (message: VersionedMessage) => {
    const fee = await connection.getFeeForMessage(message);
    return fee
}

const calculateComputeUnits = async (transactionInstructions: TransactionInstruction[]) => {
    const units = await getSimulationComputeUnits(
        connection,
        transactionInstructions,
        quartzKeypair.publicKey,
        []
    );
    return units
}
