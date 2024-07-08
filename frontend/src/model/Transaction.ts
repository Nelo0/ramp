export enum Status {
    FAIL = "FAIL",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS"
}

export interface Transaction {
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