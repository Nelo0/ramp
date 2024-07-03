import Image from "next/image";
import styles from "./TransactionCard.module.css";
import { Transaction } from "@/model/Transaction";
import CurrencyInfo from "./CurrencyInfo";
import TransactionStatus from "./TransactionStatus";
import { useState } from "react";
import { hashToDisplayString } from "@/utils/solanaUtils";

interface TransactionCardProps {
    key: number;
    transaction: Transaction;
}

export default function TransactionCard({key, transaction} : TransactionCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const transactionTypeText = transaction.offRamp ? "Off-ramp" : "On-ramp";
    const fiatPrefix = transaction.offRamp ? "Destination" : "Source";

    const formattedDate = transaction.time.toLocaleDateString("en-IE", {
        month: "long",
        day: "numeric"
    });
    const formattedTime = transaction.time.toLocaleTimeString("en-IE", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const formattedDateTime = `${formattedDate}, ${formattedTime}`;

    return (
        <li key={key} className={styles["transaction-card-wrapper"]}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`glass ${styles["transaction-card"]}`}
            >
                <div className={`glass ${styles["card-base"]} ${isOpen && styles["selected"]}`}>
                    <div className={styles["currencies"]}>
                        <CurrencyInfo src="/euro.svg" name={transaction.inputCurrency} amount={transaction.amountInputCurrency}/>

                        <Image
                            src="/right-arrow.svg"
                            alt="converted into"
                            height={19}
                            width={26.4}
                        />

                        <CurrencyInfo src="/euro.svg" name={transaction.outputCurrency} amount={transaction.amountOutputCurrency}/>
                    </div>

                    <div className={styles["basic-info"]}>
                        <p className={"light"}>{formattedTime}</p>
                        
                        <TransactionStatus status={transaction.status}/>
                    </div>
                </div>

                {isOpen &&
                    <div className={styles["card-details"]}>
                        <p className="light">Transaction type</p> <p>{transactionTypeText}</p>
                        <p className="light">Created on</p> <p>{formattedDateTime}</p>
                        <p className="light">{fiatPrefix} IBAN</p> <p>{transaction.iban}</p>
                        <p className="light">{fiatPrefix} BIC</p> <p>{transaction.bic}</p>
                        <p className="light">Solana gas fee</p> <p>{transaction.gasFeeEuro}</p>
                        <p className="light">Transaction fee</p> <p>{transaction.transactionFeeEuro}</p>
                        <p className="light">Transaction hash</p> <p>{hashToDisplayString(transaction.transactionHash)}</p>
                    </div>
                }
            </button>
        </li>
    )
}