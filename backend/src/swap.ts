import { AddressLookupTableAccount, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import bs58 from 'bs58';
import { connection } from './mockOfframp.js';

// It is recommended that you use your own RPC endpoint.
// This RPC endpoint is only for demonstration purposes so that this example will run.
const getSwapIntructions = async () => {
  const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || '')));

  // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
  const quoteResponse = await (
    await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112\
  &outputMint=2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg\
  &amount=${LAMPORTS_PER_SOL}\
  &slippageBps=20`
    )
  ).json();
  // console.log({ quoteResponse })
  
  //TODO: IN the future we could use the MAX accounts property to ensure that the wrapping, swap and send instructions all fit in one transaction.
  const instructions = await (
    await fetch('https://quote-api.jup.ag/v6/swap-instructions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // quoteResponse from /quote api
        quoteResponse,
        userPublicKey: swapUserKeypair.publicKey.toBase58(),
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
  
  const blockhash = (await connection.getLatestBlockhash()).blockhash;

  const swapInstructionsArray = [
          // uncomment if needed: ...setupInstructions.map(deserializeInstruction),
          setupInstructions.map(deserializeInstruction),
          deserializeInstruction(swapInstructionPayload),
          // uncomment if needed: deserializeInstruction(cleanupInstruction),
  ]
  
  const messageV0 = new TransactionMessage({
    payerKey: payerPublicKey,
    recentBlockhash: blockhash,
    instructions: swapInstructionsArray,
  }).compileToV0Message(addressLookupTableAccounts);
  const transaction = new VersionedTransaction(messageV0);
  
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
    keys: instruction.accounts.map((key) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable,
    })),
    data: Buffer.from(instruction.data, "base64"),
  });
};
