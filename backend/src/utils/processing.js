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
import { txIdFile } from "./enviroment.js";
import * as fs from 'fs/promises';
export function addStringToJson(newString) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the JSON file
            const fileContent = yield fs.readFile(txIdFile, 'utf8');
            const json = JSON.parse(fileContent);
            // Check if 'data' property exists and is an array
            if (Array.isArray(json.data)) {
                json.data.push(newString);
            }
            else {
                throw new Error("'data' property is not an array");
            }
            // Write the updated JSON back to the file
            const updatedJson = JSON.stringify(json, null, 2);
            yield fs.writeFile(txIdFile, updatedJson, 'utf8');
        }
        catch (error) {
            console.error(`An error occurred when adding ${newString} to a file:  ${error}`);
        }
    });
}
export const filterProcessedSigsJson = (signatureObjects) => __awaiter(void 0, void 0, void 0, function* () {
    // Read the JSON file
    const fileContent = yield fs.readFile(txIdFile, 'utf8');
    const json = JSON.parse(fileContent);
    let signatures = [];
    // Check if 'data' property exists and is an array
    if (!Array.isArray(json.data)) {
        throw new Error("'data' property is not an array");
    }
    if (signatureObjects == undefined) {
        console.log("SignatureObjects array is empty");
        return;
    }
    for (const obj of signatureObjects) {
        const signature = obj.signature;
        const isInFile = json.data.includes(signature);
        if (!isInFile) {
            signatures.push(signature);
        }
    }
    return signatures;
});
export const filterProcessedSignaturesNew = (signatureObjects) => __awaiter(void 0, void 0, void 0, function* () {
    const processedSigs = yield getProcessedSignatures(10);
    if (processedSigs == undefined)
        throw Error("Getting processed signatures returned undefined");
    let signatures = [];
    if (signatureObjects == undefined) {
        throw Error("signatureObjects array is empty");
    }
    for (const obj of signatureObjects) {
        const signature = obj.signature;
        const isInFile = processedSigs.some(sig => sig.signature === signature);
        if (!isInFile) {
            signatures.push(signature);
        }
    }
    return signatures;
});
