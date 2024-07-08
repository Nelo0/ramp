var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NATIVE_MINT, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSyncNativeInstruction, getAccount } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { SOLANA_RPC_ENDPOINT, quartzKeypair } from "./enviroment.js";
const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
const getAirdrop = () => __awaiter(void 0, void 0, void 0, function* () {
    const airdropSignature = yield connection.requestAirdrop(quartzKeypair.publicKey, 2 * LAMPORTS_PER_SOL);
    yield connection.confirmTransaction(airdropSignature);
});
const wrapSol = (lamports) => __awaiter(void 0, void 0, void 0, function* () {
    const associatedTokenAccount = yield getAssociatedTokenAddress(NATIVE_MINT, quartzKeypair.publicKey, true);
    console.log("ATA : ", associatedTokenAccount);
    // Create token account to hold your wrapped SOL
    const ataTransaction = new Transaction()
        .add(createAssociatedTokenAccountInstruction(quartzKeypair.publicKey, associatedTokenAccount, quartzKeypair.publicKey, NATIVE_MINT));
    yield sendAndConfirmTransaction(connection, ataTransaction, [quartzKeypair]);
    // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
    const solTransferTransaction = new Transaction()
        .add(SystemProgram.transfer({
        fromPubkey: quartzKeypair.publicKey,
        toPubkey: associatedTokenAccount,
        lamports: lamports
    }), createSyncNativeInstruction(associatedTokenAccount));
    yield sendAndConfirmTransaction(connection, solTransferTransaction, [quartzKeypair]);
    return associatedTokenAccount;
});
const getAccountData = (associatedTokenAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const accountInfo = yield getAccount(connection, associatedTokenAccount);
    console.log(`Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`);
});
