import TransactionCard from "@/components/TransactionCard";
import styles from "./page.module.css";
import { Transaction } from "@/model/Transaction";

export default function Transactions() {
    // TODO - Remove hardcoding
    const transactions: Transaction[] = [
        {
            offRamp: true,
            inputCurrency: "WIF",
            outputCurrency: "Euro",
            amountInputCurrency: 120, 
            amountOutputCurrency: 215.22,
            time: new Date(),
            gasFeeEuro: 0.21,
            transactionFeeEuro: 1.08,
            iban: "IE29AIBK93115212345678",
            bic: "AIBKIE2D",
            transactionHash: "5iqJ4vFh9mkne3N8f7znEZFb8mWX5BBy6KgHm1yEgecdyy1inHozMWootqxGfDJiyVHqvRYF45SjxRARZNtK699K"
        }
    ];

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