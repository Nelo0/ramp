var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getProcessedSignatures } from "../database/schema.js";
import { Status } from "../types/index.js";
export const getPastTxObjects = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const txObjects = [];
    const processedSigs = yield getProcessedSignatures(10);
    if (processedSigs == undefined) {
        throw Error("Database call to get processed signatures retuned undefined");
    }
    const sigArray = processedSigs.map(row => row.signature); // Map over the rows to extract the signatures
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
        });
    }
    return txObjects;
});
