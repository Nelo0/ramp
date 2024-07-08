var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ComputeBudgetProgram, SystemProgram } from "@solana/web3.js";
import { connection, quartzKeypair } from "../utils/enviroment.js";
import { getSimulationComputeUnits } from "@solana-developers/helpers";
import { instructionsIntoV0, sendTransactionLogic } from "../utils/transactionSender.js";
export const returnFunds = (toAddress, amount, splToken) => __awaiter(void 0, void 0, void 0, function* () {
    let instructions;
    if (splToken) {
        //instructions = returnSpl();
        instructions = yield returnLamportIx(toAddress, amount);
    }
    else {
        instructions = yield returnLamportIx(toAddress, amount);
    }
    const transaction = yield instructionsIntoV0(instructions, quartzKeypair);
    const sig = yield sendTransactionLogic(transaction);
    if (sig == "") {
        console.log("There was an error sending back funds");
        return false;
    }
    return true;
});
const returnLamportIx = (toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultFee = 5000;
    const computeUnits = 500;
    const microLamports = 500000;
    const lamportsForFee = ((microLamports * computeUnits) / 1000000) + defaultFee;
    const returnAmount = amount - lamportsForFee;
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnits
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 500000
    });
    return [
        modifyComputeUnits,
        addPriorityFee,
        SystemProgram.transfer({
            fromPubkey: quartzKeypair.publicKey,
            toPubkey: toAddress,
            lamports: returnAmount,
        })
    ];
});
const returnSplIx = () => __awaiter(void 0, void 0, void 0, function* () {
});
const calculateFee = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const fee = yield connection.getFeeForMessage(message);
    return fee;
});
const calculateComputeUnits = (transactionInstructions) => __awaiter(void 0, void 0, void 0, function* () {
    const units = yield getSimulationComputeUnits(connection, transactionInstructions, quartzKeypair.publicKey, []);
    return units;
});
