import { getProcessedSignatures } from "../database/schema.js";
import { txIdFile } from "./enviroment.js";
import * as fs from 'fs/promises';

interface JsonStructure {
    data: string[];
}

export async function addStringToJson(newString: string): Promise<void> {
    try {
        // Read the JSON file
        const fileContent = await fs.readFile(txIdFile, 'utf8');
        const json: JsonStructure = JSON.parse(fileContent);

        // Check if 'data' property exists and is an array
        if (Array.isArray(json.data)) {
            json.data.push(newString);
        } else {
            throw new Error("'data' property is not an array");
        }

        // Write the updated JSON back to the file
        const updatedJson = JSON.stringify(json, null, 2);
        await fs.writeFile(txIdFile, updatedJson, 'utf8');
    } catch (error) {
        console.error(`An error occurred when adding ${newString} to a file:  ${error}`);
    }
}

export const filterProcessedSigsJson = async (signatureObjects: any) => {
    // Read the JSON file
    const fileContent = await fs.readFile(txIdFile, 'utf8');
    const json: JsonStructure = JSON.parse(fileContent);
    let signatures = []

    // Check if 'data' property exists and is an array
    if (!Array.isArray(json.data)) {
        throw new Error("'data' property is not an array");
    }

    if (signatureObjects == undefined) {
        console.log("SignatureObjects array is empty")
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
}

export const filterProcessedSignaturesNew = async (signatureObjects: any) => {
    const processedSigs = await getProcessedSignatures(10)
    if (processedSigs == undefined) throw Error("Getting processed signatures returned undefined")

    let signatures: string[] = []

    if (signatureObjects == undefined) {
        throw Error("signatureObjects array is empty")
    }
    for (const obj of signatureObjects) {
        const signature = obj.signature;
        const isInFile = processedSigs.some(sig => sig.signature === signature);

        if (!isInFile) {
            signatures.push(signature);
        }
    }
    return signatures;
}