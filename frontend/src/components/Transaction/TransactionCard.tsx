import Image from "next/image";
import styles from "./TransactionCard.module.css";
import { Transaction } from "@/model/Transaction";
import CurrencyInfo from "./CurrencyInfo";
import TransactionStatus from "./TransactionStatus";
import { useState } from "react";
import { hashToDisplayString } from "@/utils/solanaUtils";
import Link from "next/link";

interface TransactionCardProps {
    transaction: Transaction;
    dateLabelled: boolean;
}

export default function TransactionCard({transaction, dateLabelled} : TransactionCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const transactionTypeText = transaction.offRamp ? "Off-ramp" : "On-ramp";
    const fiatPrefix = transaction.offRamp ? "Destination" : "Source";


    // Formatted date/time strings
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


    // Formatted date label
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let dateLabel = formattedDate;
    if (transaction.time.setHours(0,0,0,0) === today.setHours(0,0,0,0)) dateLabel = "Today";
    else if (transaction.time.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0)) dateLabel = "Yesterday";


    const inputTokenIcon = "/tokens/sol.jpg"; // TODO - Remove hardcoding
    const outputTokenIcon = "/euro.svg";

    return (
        <li className={styles["transaction-card-wrapper"]}>
            {dateLabelled && 
                <div className={styles["date-label"]}>
                    <small className="light">{dateLabel}</small>
                </div>
            }
            <div className={`glass ${styles["transaction-card"]}`}>
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className={`glass ${styles["card-base"]} ${isOpen && styles["selected"]}`}
                >
                    <div className={styles["currencies"]}>
                        <CurrencyInfo src={inputTokenIcon} name={transaction.inputCurrency} amount={transaction.amountInputCurrency}/>

                        <Image
                            src="/right-arrow.svg"
                            alt="converted into"
                            height={19}
                            width={26.4}
                        />

                        <CurrencyInfo src={outputTokenIcon} name={transaction.outputCurrency} amount={transaction.amountOutputCurrency}/>
                    </div>

                    <div className={styles["basic-info"]}>
                        <p className={"light"}>{formattedTime}</p>
                        
                        <TransactionStatus status={transaction.status}/>
                    </div>
                </button>

                {isOpen &&
                    <div className={styles["card-details"]}>
                        <p className="light">Transaction type</p> <p>{transactionTypeText}</p>
                        <p className="light">Created on</p> <p>{formattedDateTime}</p>
                        <p className="light">{fiatPrefix} IBAN</p> <p>{transaction.iban}</p>
                        <p className="light">{fiatPrefix} BIC</p> <p>{transaction.bic}</p>
                        <p className="light">Solana gas fee</p> <p>~€{transaction.gasFeeEuro}</p>
                        <p className="light">Transaction fee</p> <p>€{transaction.transactionFeeEuro} <span className="light">(0.5%)</span></p>
                        <p className="light">Transaction hash</p>
                        <div className={styles["transaction-hash"]}>
                            <p className={styles["hash-display"]}>{hashToDisplayString(transaction.transactionHash)}</p>
                            <button 
                                className={styles["hash-button"]}
                                onClick={() => navigator.clipboard.writeText(transaction.transactionHash)}
                            >
                                <Image
                                    src="/copy_white.svg"
                                    alt="Copy"
                                    height={17}
                                    width={17}
                                />
                            </button>
                            <a target="blank_" href={"https://solana.fm/tx/" + transaction.transactionHash}>
                                <button className={styles["hash-button"]}>
                                    <Image
                                        src="/open_link.svg"
                                        alt="Open in explorer"
                                        height={15}
                                        width={15}
                                    />
                                </button>
                            </a>
                        </div>
                    </div>
                }
            </div>
        </li>
    )
}