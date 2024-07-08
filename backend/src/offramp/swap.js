var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AddressLookupTableAccount, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { connection, quartzKeypair, quartzStableATA, stableTokenMint } from '../utils/enviroment.js';
import { initiateEuroeBurn } from './euroe.js';
import { formatAmountForEuroe } from '../utils/utils.js';
import { getATAOrInstruction, instructionsIntoV0 } from '../utils/transactionSender.js';
import { createTransferCheckedInstruction } from '@solana/spl-token';
export const getSwapIntructions = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Deposit amount: ", amount);
    const quoteResponse = yield (yield fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg&amount=${amount}&slippageBps=20`)).json();
    const expectedOutputAmount = Number(quoteResponse.outAmount);
    const worstCaseOutput = Number(quoteResponse.otherAmountThreshold);
    console.log("expectedOutputAmount", expectedOutputAmount);
    console.log("worstCaseOutput", worstCaseOutput);
    const euroeOfframpAmount = formatAmountForEuroe(worstCaseOutput);
    console.log("euroeOfframpAmount", euroeOfframpAmount);
    const euroeDepositAddress = yield initiateEuroeBurn(euroeOfframpAmount);
    const euroeATAObj = yield getATAOrInstruction(stableTokenMint, new PublicKey(euroeDepositAddress));
    //TODO: IN the future we could use the MAX accounts property to ensure that the wrapping, swap and send instructions all fit in one transaction.
    const instructions = yield (yield fetch('https://quote-api.jup.ag/v6/swap-instructions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: quartzKeypair.publicKey.toBase58(),
            prioritizationFeeLamports: 1000000
        })
    })).json();
    if (instructions.error) {
        throw new Error("Failed to get swap instructions: " + instructions.error);
    }
    const { tokenLedgerInstruction, // If you are using `useTokenLedger = true`.
    computeBudgetInstructions, // The necessary instructions to setup the compute budget.
    setupInstructions, // Setup missing ATA for the users.
    swapInstruction: swapInstructionPayload, // The actual swap instruction.
    cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
    addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
     } = instructions;
    const addressLookupTableAccounts = [];
    addressLookupTableAccounts.push(...(yield getAddressLookupTableAccounts(addressLookupTableAddresses)));
    //send to QUARTZ EUROe address
    const sendToOfframpInstruction = createTransferCheckedInstruction(quartzStableATA, // from (should be a token account)
    stableTokenMint, // mint
    euroeATAObj.address, // to  - euroe address
    quartzKeypair.publicKey, // from owner
    worstCaseOutput, // amount, if your deciamls is 8, send 10^8 for 1 token
    6 // decimals
    );
    const swapInstructionsArray = [
        ...setupInstructions.map(deserializeInstruction),
        deserializeInstruction(swapInstructionPayload),
        sendToOfframpInstruction,
    ];
    if (euroeATAObj.instruction != undefined)
        swapInstructionsArray.unshift(euroeATAObj.instruction);
    const transaction = yield instructionsIntoV0(swapInstructionsArray, quartzKeypair, addressLookupTableAccounts);
    const info = {
        transaction: transaction,
        computeUnits: null,
        worstOutput: worstCaseOutput,
        bestOutput: expectedOutputAmount
    };
    return info;
});
const getAddressLookupTableAccounts = (keys) => __awaiter(void 0, void 0, void 0, function* () {
    const addressLookupTableAccountInfos = yield connection.getMultipleAccountsInfo(keys.map((key) => new PublicKey(key)));
    return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
        const addressLookupTableAddress = keys[index];
        if (accountInfo) {
            const addressLookupTableAccount = new AddressLookupTableAccount({
                key: new PublicKey(addressLookupTableAddress),
                state: AddressLookupTableAccount.deserialize(accountInfo.data),
            });
            acc.push(addressLookupTableAccount);
        }
        return acc;
    }, new Array());
});
const deserializeInstruction = (instruction) => {
    return new TransactionInstruction({
        programId: new PublicKey(instruction.programId),
        keys: instruction.accounts.map((key) => ({
            pubkey: new PublicKey(key.pubkey),
            isSigner: key.isSigner,
            isWritable: key.isWritable,
        })),
        data: Buffer.from(instruction.data, "base64"),
    });
};
