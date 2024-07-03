import Image from "next/image";
import styles from "./TransactionCard.module.css";
import { Transaction } from "@/model/Transaction";
import CurrencyInfo from "./CurrencyInfo";

interface TransactionCardProps {
    key: number;
    transaction: Transaction;
}

export default function TransactionCard({key, transaction} : TransactionCardProps) {
    return (
        <li key={key} className={`glass ${styles["transaction-card"]}`}>
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
        </li>
    )
}