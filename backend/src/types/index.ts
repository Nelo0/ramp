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

export type TransactionDataDb = {
    txId?: number,
    offramp?: boolean,
    status?: string,
    txHash?: string,
    depositHash?: string,
    amountInput?: number,
    amountOutput?: number,
    gasFee?: number,
    txFee?: number
}

export interface EditTransactionDataDb {
    offramp: boolean,
    amount_input_currency: number | string,
    amount_output_currency: number | string,
    gas_fee_euro: number | string,
    transaction_fee_euro: number | string,
    transaction_hash: string,
    deposit_hash: string,
    status: string,
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