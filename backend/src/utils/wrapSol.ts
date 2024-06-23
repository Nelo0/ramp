import { NATIVE_MINT, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSyncNativeInstruction, getAccount } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import { SOLANA_RPC_ENDPOINT, quartzKeypair } from "./enviroment.js";

const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

const getAirdrop = async () => {
    const airdropSignature = await connection.requestAirdrop(
        quartzKeypair.publicKey,
        2 * LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);
}

const wrapSol = async (lamports: number) => {
    const associatedTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        quartzKeypair.publicKey,
        true,
    )
    console.log("ATA : ", associatedTokenAccount);

    // Create token account to hold your wrapped SOL
    const ataTransaction = new Transaction()
        .add(
            createAssociatedTokenAccountInstruction(
                quartzKeypair.publicKey,
                associatedTokenAccount,
                quartzKeypair.publicKey,
                NATIVE_MINT
            )
        );

    await sendAndConfirmTransaction(connection, ataTransaction, [quartzKeypair]);

    // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
    const solTransferTransaction = new Transaction()
        .add(
            SystemProgram.transfer({
                fromPubkey: quartzKeypair.publicKey,
                toPubkey: associatedTokenAccount,
                lamports: lamports
            }),
            createSyncNativeInstruction(
                associatedTokenAccount
            )
        )

    await sendAndConfirmTransaction(connection, solTransferTransaction, [quartzKeypair]);

    return associatedTokenAccount
}

const getAccountData = async (associatedTokenAccount: PublicKey) => {

    const accountInfo = await getAccount(connection, associatedTokenAccount);

    console.log(`Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`);
}