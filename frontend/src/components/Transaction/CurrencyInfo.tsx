import Image from "next/image";
import styles from "./CurrencyInfo.module.css";

interface CurrencyInfoProps {
    src: string;
    name: string;
    amount: number;
}

export default function CurrencyInfo({src, name, amount}: CurrencyInfoProps) {
    const THRESHOLD = 7;

    const amountStr = amount.toString();
    const belowThreshold = amountStr.length <= THRESHOLD;
    const displayAmount = belowThreshold ? amountStr : amountStr.slice(0,THRESHOLD) + "...";

    return (
        <div className={styles["currency-info"]}>
            <Image
                className={styles["currency-icon"]}
                src={src}
                alt=""
                height={36}
                width={36}
            />

            <p className={styles["currency-name"]}>{name}</p>

            <p className={"light"}>{displayAmount}</p>
        </div>
    )
}