import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { NATIVE_MINT, createAssociatedTokenAccount, createMint, createMintToCheckedInstruction, createSyncNativeInstruction, createTransferCheckedInstruction } from '@solana/spl-token'
import * as dotenv from "dotenv"

dotenv.config();

const HELIUS_APIKEY = process.env.HELIUS_APIKEY;

//export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
export const connection = new Connection(`https://devnet.helius-rpc.com/?api-key=${HELIUS_APIKEY}`, 'confirmed')
export const mockEurTokenMint = new PublicKey("EZ27nebW1LDgxugqdNJJGdubteUzbzWAztjiXxdF3G9D")
export const mockDepositEurATA = new PublicKey("8ovGPwc86ESG6wJ3EdPGDmT2tabzs3Ksf8xB2Dxf6ZSn")

//6sv5cX4U38aNs5KujEqTyNqDct5DmjAoZKZA4JN6fEJV
export const quartzKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
        16, 206, 195, 248, 10, 110, 149, 249, 112, 47, 45,
        252, 238, 186, 86, 147, 171, 70, 247, 57, 193, 206,
        246, 214, 126, 93, 206, 201, 47, 50, 246, 155, 87,
        85, 126, 7, 2, 223, 25, 130, 169, 233, 204, 127,
        11, 153, 29, 243, 214, 148, 143, 3, 240, 48, 75,
        191, 67, 134, 186, 80, 48, 172, 146, 234
    ])
);

//HnQWqxiMy83iw8iMgX5JQD9WwTaA8wa62Zyt9x1vuaeE
export const mockStableOfframpKeypair = Keypair.fromSecretKey(
    Uint8Array.from([
        169, 210, 231, 104, 23, 149, 227, 104, 2, 214, 171,
        69, 13, 4, 209, 251, 72, 242, 173, 225, 240, 162,
        54, 8, 132, 63, 89, 116, 172, 61, 184, 33, 249,
        92, 183, 24, 190, 35, 227, 158, 161, 73, 191, 174,
        195, 78, 175, 131, 203, 168, 194, 251, 255, 178, 165,
        214, 16, 54, 216, 178, 46, 251, 69, 67
    ])
);

export const mockStableOfframpATA = new PublicKey("HCqCFZQNhRnxJAvtGscFKXM6hxoiRvPhPpivGNUq2heP")

//create mint 
const createTokenMint = async (wallet: Keypair) => {
    let mintPubkey = await createMint(
        connection, // conneciton
        wallet, // fee payer
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
        6 // decimals
    );

    return mintPubkey;
}

//create ata for an address
const createMintATAForWallet = async (address: PublicKey) => {

    let ata = await createAssociatedTokenAccount(
        connection, // connection
        quartzKeypair, // fee payer
        mockEurTokenMint, // for token mint
        //NATIVE_MINT, //For wrapped sol
        address // owner of the ATA
    );

    console.log("ata:", ata.toBase58())

    return ata;
}

export const getMockOfframpTx = (depositAmount: number) => {

    //wrap SOL into wSOL
    const mockWSolATA = new PublicKey("H2K7SVi9Z5n7kPZKrtLBsfjRxx5fKtgVWFTWu1hE5LjH");

    const offrampSolTransaction = new Transaction()
        .add(
            SystemProgram.transfer({
                fromPubkey: quartzKeypair.publicKey,
                toPubkey: mockWSolATA,
                lamports: depositAmount
            }),
            createSyncNativeInstruction(
                mockWSolATA
            )
        )
    //Swap deposit amount into EUROe on Jupiter  (When testing just mock the swap)

    //MOCK SWAP -> SEND LAMPORTS TO OTHER ADDRESS
    offrampSolTransaction.add(
        createTransferCheckedInstruction(
            mockWSolATA, // from (should be a token account)
            NATIVE_MINT, // mint
            new PublicKey("GgKBSo1GcaD4kE7dMtWWQ4bq5RQe16PyB6gPBEazoLJ9"), // ata to a "random wallet" (its actually my wallet)
            quartzKeypair.publicKey, // from's owner
            depositAmount, // amount, if your deciamls is 8, send 10^8 for 1 token
            9 // decimals
        )
    )
    //MOCK SWAP -> MINT TOKENS TO ATA
    offrampSolTransaction.add(
        //for mock -> send lamports to random address, mint tokens to quartz ata.
        createMintToCheckedInstruction(
            mockEurTokenMint, // mint
            mockDepositEurATA, // receiver (should be a token account)
            quartzKeypair.publicKey, // mint authority
            1e6, // amount. if your decimals is 8, you mint 10^8 for 1 token.
            6 // decimals
        )
    )
    //send to QUARTZ EUROe address.
    offrampSolTransaction.add(
        createTransferCheckedInstruction(
            mockDepositEurATA, // from (should be a token account)
            mockEurTokenMint, // mint
            mockStableOfframpATA, // to  - euroe address
            quartzKeypair.publicKey, // from's owner
            1e6, // amount, if your deciamls is 8, send 10^8 for 1 token
            6 // decimals
        )
    )

    return offrampSolTransaction;
}