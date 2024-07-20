import { Status } from "@/model/Transaction";
import styles from "./TransactionStatus.module.css";

interface TransactionStatusProps {
    status: Status;
}

export default function TransactionStatus({status} : TransactionStatusProps) {
    const success = "Successful";
    const processing = "In progress";
    const fail = "Failed";
    const loading = "Loading..."

    if (status === Status.SUCCESS) return ( <p className={styles["success"]}>{success}</p> )
    if (status === Status.PROCESSING) return ( <p className={styles["processing"]}>{processing}</p> )
    if (status === Status.FAIL) return ( <p className={styles["fail"]}>{fail}</p> )
    if (status === Status.LOADING) return ( <p className={styles["loading"]}>{loading}</p>)
    else throw new TypeError("Invalid status");
}