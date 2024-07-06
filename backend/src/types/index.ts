export enum Status {
    FAIL,
    PROCESSING,
    SUCCESS
}

export interface TransactionData {
    offRamp: boolean;
    inputCurrency: string; // Change to Token type?
    outputCurrency: string;
    amountInputCurrency: number;
    amountOutputCurrency: number;
    time: Date;
    gasFeeEuro: number;
    transactionFeeEuro: number;
    iban: string;
    bic: string;
    transactionHash: string; // Change to Solana Hash type?
    depositHash: string;
    status: Status;
}

export type SignatureRow = {
    signature: string;
};

export interface User {
    user_id: number;
    email: string;
    wallet_address: string;
    created_at: Date;
    iban: string;
    bic: string;
}