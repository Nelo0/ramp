export enum Status {
    FAIL = "FAIL",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    LOADING = "LOADING",
}

export interface Transaction {
    offRamp: boolean;
    inputCurrency: string; // TODO - Change to Token type?
    outputCurrency: string;
    amountInputCurrency: number;
    amountOutputCurrency: number;
    time: string; // TODO - Change to Date type
    gasFeeEuro: number;
    transactionFeeEuro: number;
    iban: string;
    bic: string;
    transactionHash: string; // TODO - Change to Solana Hash type?
    depositHash: string;
    status: Status;
}