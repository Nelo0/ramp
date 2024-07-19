import Image from "next/image";
import styles from "./TransactionCard.module.css";
import { Transaction } from "@/model/Transaction";
import CurrencyInfo from "./CurrencyInfo";
import TransactionStatus from "./TransactionStatus";
import { useEffect, useRef, useState } from "react";
import { hashToDisplayString } from "@/utils/solanaUtils";
import Link from "next/link";

interface TransactionCardProps {
    transaction: Transaction;
    dateLabelled: boolean;
}

export default function TransactionCard({transaction, dateLabelled} : TransactionCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const detailsRef = useRef<HTMLDivElement>(null);

    const transactionTypeText = transaction.offRamp ? "Off-ramp" : "On-ramp";
    const fiatPrefix = transaction.offRamp ? "Destination" : "Source";

    // Formatted date/time strings
    const timeObj = new Date(transaction.time);
    const formattedDate = timeObj.toLocaleDateString("en-IE", {
        month: "long",
        day: "numeric"
    });
    const formattedTime = timeObj.toLocaleTimeString("en-IE", {
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
    if (timeObj.setHours(0,0,0,0) === today.setHours(0,0,0,0)) dateLabel = "Today";
    else if (timeObj.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0)) dateLabel = "Yesterday";


    // Format € symbol
    const isInputEuro = transaction.inputCurrency == "EUR"; // TODO - Change to a "Token" class
    const isOutputEuro = transaction.outputCurrency == "EUR"; // TODO - Change to a "Token" class

    const inputTokenIcon = "/tokens/sol.jpg"; // TODO - Remove hardcoding
    const outputTokenIcon = "/euro.svg";


    // Handle opening and closing transaction details
    const PADDING_VERTICLE = 20;
    const PADDING_HORIZONTAL = 20;
    useEffect(() => {
        if (detailsRef.current) {
            if (isOpen) {
                detailsRef.current.style.maxHeight = `${detailsRef.current.scrollHeight + (PADDING_VERTICLE*2)}px`;
                detailsRef.current.style.padding = `${PADDING_VERTICLE}px ${PADDING_HORIZONTAL}px`;
            } else {
                detailsRef.current.style.maxHeight = '0px';
                detailsRef.current.style.padding = `0px ${PADDING_HORIZONTAL}px`;
            }
        }
    }, [isOpen]);

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
                            src="/right_arrow.svg"
                            alt="converted into"
                            height={0}
                            width={0}
                            className={styles["arrow"]}
                        />

                        <CurrencyInfo src={outputTokenIcon} name={transaction.outputCurrency} amount={transaction.amountOutputCurrency}/>
                    </div>

                    <div className={styles["basic-info"]}>
                        <p>{formattedTime}</p>
                        
                        <TransactionStatus status={transaction.status}/>
                    </div>
                </button>
                
                <div ref={detailsRef} className={`${styles["card-details"]} ${isOpen && styles["open"]}`}>
                    <p className="light">Transaction type</p> <p>{transactionTypeText}</p>
                    <p className="light">Created on</p> <p>{formattedDateTime}</p>
                    <p className="light">{transaction.inputCurrency} sent</p> <p>{isInputEuro && "€"}{transaction.amountInputCurrency}</p>
                    <p className="light">{transaction.outputCurrency} received</p> <p>{isOutputEuro && "€"}{transaction.amountOutputCurrency}</p>
                    <p className="light">Solana gas fee</p> <p>~€{transaction.gasFeeEuro}</p>
                    <p className="light">Transaction fee</p> <p>€{transaction.transactionFeeEuro} <span className="light">(0.5%)</span></p>
                    <p className="light">{fiatPrefix} IBAN</p> <p>{transaction.iban}</p>
                    <p className="light">{fiatPrefix} BIC</p> <p>{transaction.bic}</p>
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
            </div>
        </li>
    )
}