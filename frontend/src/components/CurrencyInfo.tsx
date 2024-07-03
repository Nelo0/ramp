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
                src={src}
                alt=""
                height={36}
                width={36}
            />

            <p>{name}</p>

            <p className={styles["currency-name"]}>{amount}</p>
        </div>
    )
}