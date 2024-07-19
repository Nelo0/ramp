import TransactionCard from "@/components/Transaction/TransactionCard";
import styles from "./page.module.css";
import { Status, Transaction } from "@/model/Transaction";

interface TransactionsProps {
    transactions: Transaction[]
}

export default function Transactions({transactions} : TransactionsProps) { 
    //TOOD remove tmp below
    transactions[0] = {
        offRamp: true,
        inputCurrency: "SOL",
        outputCurrency: "EUR",
        amountInputCurrency: 0.28193219837291,
        amountOutputCurrency: 32189321,
        time: "2019-09-07T15:50",
        gasFeeEuro: 0.1,
        transactionFeeEuro: 100,
        iban: "foo",
        bic: "foo",
        transactionHash: "foo",
        depositHash: "foo",
        status: Status.PROCESSING
    }

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