import TransactionCard from "@/components/Transaction/TransactionCard";
import styles from "./page.module.css";
import { Status, Transaction } from "@/model/Transaction";

interface TransactionsProps {
    transactions: Transaction[]
}

export default function Transactions({transactions} : TransactionsProps) { 
    let lastDate: Date | null = null;
    return (
        <div className={`glass ${styles["transactions"]}`}>
            <h2 className={styles["heading"]}>Transactions</h2>
            <ul className={styles["transactions-content"]}>
                {transactions.map((transaction, index) => {
                    let isFirstOfDay = !lastDate || lastDate.setHours(0,0,0,0) !== new Date(transaction.time).setHours(0,0,0,0);
                    lastDate = new Date(transaction.time);

                    return (
                        <TransactionCard
                            key={index}
                            transaction={transaction}
                            dateLabelled={isFirstOfDay}
                        />
                    );
                })}
            </ul>
        </div>
    )
}