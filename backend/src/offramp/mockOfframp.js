var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { NATIVE_MINT, createMintToCheckedInstruction, createSyncNativeInstruction, createTransferCheckedInstruction } from '@solana/spl-token';
import { offrampDepositATA, quartzKeypair, quartzStableATA, quartzWSolATA, stableTokenMint } from '../utils/enviroment.js';
import { instructionsIntoV0 } from '../utils/transactionSender.js';
//Owner of the mock offrampDepositATA
//HnQWqxiMy83iw8iMgX5JQD9WwTaA8wa62Zyt9x1vuaeE
const mockStableOfframpKeypair = Keypair.fromSecretKey(Uint8Array.from([
    169, 210, 231, 104, 23, 149, 227, 104, 2, 214, 171,
    69, 13, 4, 209, 251, 72, 242, 173, 225, 240, 162,
    54, 8, 132, 63, 89, 116, 172, 61, 184, 33, 249,
    92, 183, 24, 190, 35, 227, 158, 161, 73, 191, 174,
    195, 78, 175, 131, 203, 168, 194, 251, 255, 178, 165,
    214, 16, 54, 216, 178, 46, 251, 69, 67
]));
export const getMockOfframpInfo = (depositAmount) => __awaiter(void 0, void 0, void 0, function* () {
    //wrap SOL into wSOL
    const instructions = [
        SystemProgram.transfer({
            fromPubkey: quartzKeypair.publicKey,
            toPubkey: quartzWSolATA,
            lamports: depositAmount
        }),
        createSyncNativeInstruction(quartzWSolATA),
        createTransferCheckedInstruction(quartzWSolATA, // from (should be a token account)
        NATIVE_MINT, // mint
        new PublicKey("GgKBSo1GcaD4kE7dMtWWQ4bq5RQe16PyB6gPBEazoLJ9"), // ata to a "random wallet" (its actually my devnet wallet)
        quartzKeypair.publicKey, // from's owner
        depositAmount, // amount, if your deciamls is 8, send 10^8 for 1 token
        9 // decimals
        ),
        createMintToCheckedInstruction(stableTokenMint, // mint
        quartzStableATA, // receiver (should be a token account)
        quartzKeypair.publicKey, // mint authority
        1e6, // amount. if your decimals is 8, you mint 10^8 for 1 token.
        6 // decimals
        ),
        createTransferCheckedInstruction(quartzStableATA, // from (should be a token account)
        stableTokenMint, // mint
        offrampDepositATA, // to  - euroe address
        quartzKeypair.publicKey, // from's owner
        1e6, // amount, if your deciamls is 8, send 10^8 for 1 token
        6 // decimals
        )
    ];
    const transaction = yield instructionsIntoV0(instructions, quartzKeypair);
    return {
        transaction: transaction,
        computeUnits: null,
        worstOutput: 1e6,
        bestOutput: 1e6
    };
});
