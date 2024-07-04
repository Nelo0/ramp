import TransactionCard from "@/components/Transaction/TransactionCard";
import styles from "./page.module.css";
import { Status, Transaction } from "@/model/Transaction";

interface TransactionsProps {
    transactions: Transaction[]
}

export default function Transactions({transactions} : TransactionsProps) {
    return (
        <div className={`glass ${styles["transactions"]}`}>
            <h2 className={styles["heading"]}>Transactions</h2>
            <ul className={styles["transactions-content"]}>
                {transactions.map((transaction, index) => (
                    <TransactionCard key={index} transaction={transaction}/>
                ))}
            </ul>
        </div>
    )
}