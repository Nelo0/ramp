import Image from "next/image";
import styles from "./CurrencyInfo.module.css";
import { shortenCurrenyDisplay } from "@/utils/uiUtils";
import { useState } from "react";

interface CurrencyInfoProps {
    src: string;
    name: string;
    amount: number;
}

export default function CurrencyInfo({src, name, amount}: CurrencyInfoProps) {
    const THRESHOLD = 7;

    const isEuro = (name == "EUR");
    const displayAmount = shortenCurrenyDisplay(amount, THRESHOLD, isEuro);

    return (
        <div className={styles["currency-info"]}>
            <Image
                className={styles["currency-icon"]}
                src={src}
                alt=""
                height={36}
                width={36}
            />

            <p className={styles["currency-amount"]}>{displayAmount}</p>

            <p className={"light"}>{name}</p>
        </div>
    )
}