import Image from "next/image";
import styles from "./TransactionCard.module.css";
import { Transaction } from "@/model/Transaction";
import CurrencyInfo from "./CurrencyInfo";
import TransactionStatus from "./TransactionStatus";
import { useState } from "react";

interface TransactionCardProps {
    key: number;
    transaction: Transaction;
}

export default function TransactionCard({key, transaction} : TransactionCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li key={key} className={styles["transaction-card-wrapper"]}>
            <button className={`glass ${styles["transaction-card"]} ${isOpen && styles["selected"]}`}>
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
                    <p className={"light"}>
                        {transaction.time.toLocaleTimeString("en-IE", {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                    
                    <TransactionStatus status={transaction.status}/>
                </div>
            </button>
        </li>
    )
}