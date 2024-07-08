import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
dotenv.config();
export const SOLANA_APIKEY = process.env.HELIUS_APIKEY;
const QUICKNODE_URL = process.env.QUICKNODE_URL;
export const ENV = process.env.cluster || "mainnet-beta";
export const SOLANA_WS_ENDPOINT = ENV === "devnet"
    ? `wss://devnet.helius-rpc.com/?api-key=${SOLANA_APIKEY}`
    : `wss://mainnet.helius-rpc.com/?api-key=${SOLANA_APIKEY}`;
export const SOLANA_RPC_ENDPOINT = ENV === "devnet"
    ? `https://devnet.helius-rpc.com/?api-key=${SOLANA_APIKEY}`
    //: `https://mainnet.helius-rpc.com/?api-key=${SOLANA_APIKEY}`;
    : QUICKNODE_URL || "";
export const txIdFile = ENV === "devnet"
    ? "./test-data.json"
    : "./data.json";
export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
export const quartzStableATA = ENV === "devnet"
    ? new PublicKey("8ovGPwc86ESG6wJ3EdPGDmT2tabzs3Ksf8xB2Dxf6ZSn")
    : new PublicKey("CD1os1hA6XLDCigWz5sCh7wEUYRN36q4nuqkBKa64rEa"); //quartz EUROe ata
export const quartzWSolATA = ENV === "devnet"
    ? new PublicKey("H2K7SVi9Z5n7kPZKrtLBsfjRxx5fKtgVWFTWu1hE5LjH")
    //: new PublicKey(""); //quartz wSOL ata
    : new PublicKey("8ovGPwc86ESG6wJ3EdPGDmT2tabzs3Ksf8xB2Dxf6ZSn");
export const stableTokenMint = ENV === "devnet"
    ? new PublicKey("EZ27nebW1LDgxugqdNJJGdubteUzbzWAztjiXxdF3G9D")
    : new PublicKey("2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg"); //mainnet EUROe mint
export let offrampDepositATA = ENV === "devnet"
    ? new PublicKey("HCqCFZQNhRnxJAvtGscFKXM6hxoiRvPhPpivGNUq2heP")
    : new PublicKey("CD1os1hA6XLDCigWz5sCh7wEUYRN36q4nuqkBKa64rEa"); //Membrane finances EUROe deposit ata
export const QUARTZ_USER_LIST = ENV === "devnet"
    ? ["AmQmMCAZ1kMvBhvfCpdhD7y91Y99uQAWrrztEPdSsTZJ"]
    : ["AmQmMCAZ1kMvBhvfCpdhD7y91Y99uQAWrrztEPdSsTZJ", "GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf"]; //array of the addresses of valid Quartz users
export const quartzKeypair = ENV === "devnet"
    //6sv5cX4U38aNs5KujEqTyNqDct5DmjAoZKZA4JN6fEJV
    ? Keypair.fromSecretKey(Uint8Array.from([
        16, 206, 195, 248, 10, 110, 149, 249, 112, 47, 45,
        252, 238, 186, 86, 147, 171, 70, 247, 57, 193, 206,
        246, 214, 126, 93, 206, 201, 47, 50, 246, 155, 87,
        85, 126, 7, 2, 223, 25, 130, 169, 233, 204, 127,
        11, 153, 29, 243, 214, 148, 143, 3, 240, 48, 75,
        191, 67, 134, 186, 80, 48, 172, 146, 234
    ]))
    : Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY || "")));
