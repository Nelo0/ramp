import Image from "next/image";
import styles from "./CurrencyInfo.module.css";

interface CurrencyInfoProps {
    src: string;
    name: string;
    amount: number;
}

export default function CurrencyInfo({src, name, amount}: CurrencyInfoProps) {
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

            <p className={"light"}>{amount}</p>
        </div>
    )
}