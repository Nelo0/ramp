import { AddressLookupTableAccount, ComputeBudgetProgram, PublicKey, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { connection, quartzKeypair, quartzStableATA, stableTokenMint } from '../utils/enviroment.js';
import { initiateEuroeBurn } from './euroe.js';
import { convertAndRoundNumberToInteger, formatAmountForEuroe } from '../utils/utils.js';
import { getATAOrInstruction, instructionsIntoV0 } from '../utils/transactionSender.js';
import { createTransferCheckedInstruction } from '@solana/spl-token';

export type TransactionInfo = {
  transaction: VersionedTransaction,
  computeUnits: number | undefined | null,
  amount: number,
}

export const getSwapIntructions = async (amount: number) => {
  console.log("Deposit amount: ", amount);

  const quoteResponse = await (
    await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg&amount=${amount}&slippageBps=25`)
  ).json();

  const expectedOutputAmount = Number(quoteResponse.outAmount);
  const worstCaseOutput = Number(quoteResponse.otherAmountThreshold);
  console.log("expectedOutputAmount", expectedOutputAmount)
  console.log("worstCaseOutput", worstCaseOutput)

  const euroeOfframpAmount = formatAmountForEuroe(worstCaseOutput)
  console.log("euroeOfframpAmount", euroeOfframpAmount)
  const offrampAmount = convertAndRoundNumberToInteger(worstCaseOutput);
  console.log("offrampAmount", offrampAmount)


  const euroeDepositAddress = await initiateEuroeBurn(euroeOfframpAmount)
  const euroeATAObj = await getATAOrInstruction(stableTokenMint, new PublicKey(euroeDepositAddress))

  //TODO: IN the future we could use the MAX accounts property to ensure that the wrapping, swap and send instructions all fit in one transaction.
  const instructions = await (
    await fetch('https://quote-api.jup.ag/v6/swap-instructions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: quartzKeypair.publicKey.toBase58(),
      })
    })
  ).json();

  if (instructions.error) {
    throw new Error("Failed to get swap instructions: " + instructions.error);
  }

  const {
    tokenLedgerInstruction, // If you are using `useTokenLedger = true`.
    computeBudgetInstructions, // The necessary instructions to setup the compute budget.
    setupInstructions, // Setup missing ATA for the users.
    swapInstruction: swapInstructionPayload, // The actual swap instruction.
    cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
    addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
  } = instructions;

  const addressLookupTableAccounts: AddressLookupTableAccount[] = [];

  addressLookupTableAccounts.push(
    ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
  );

  //send to QUARTZ EUROe address
  const sendToOfframpInstruction = createTransferCheckedInstruction(
    quartzStableATA, // from (should be a token account)
    stableTokenMint, // mint
    euroeATAObj.address,// to  - euroe address
    quartzKeypair.publicKey, // from owner
    offrampAmount, // amount, if your deciamls is 8, send 10^8 for 1 token
    6 // decimals
  );

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({ 
    units: 450_000 
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ 
    microLamports: 1_000_000
  });

  const swapInstructionsArray = [
    modifyComputeUnits,
    addPriorityFee,
    ...setupInstructions.map(deserializeInstruction),
    deserializeInstruction(swapInstructionPayload),
    sendToOfframpInstruction,
  ]
  if (euroeATAObj.instruction != undefined) swapInstructionsArray.unshift(euroeATAObj.instruction)

  const transaction = await instructionsIntoV0(swapInstructionsArray, quartzKeypair, addressLookupTableAccounts);

  const info: TransactionInfo = {
    transaction: transaction,
    computeUnits: null,
    amount: offrampAmount,
  }

  return info;
}

const getAddressLookupTableAccounts = async (
  keys: string[]
): Promise<AddressLookupTableAccount[]> => {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key))
    );

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
  }, new Array<AddressLookupTableAccount>());
};

const deserializeInstruction = (instruction: any) => {
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key: any) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, "base64"),
  });
};
