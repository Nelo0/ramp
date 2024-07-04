"use client";

import Image from "next/image";
import styles from "./page.module.css";
import OffRamp from "./OffRamp";
import Transactions from "./Transactions";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Ramp() {
    const TRANSACTION_API_URL = "http://localhost:3001/api/txHistory";
    const USER_WALLET = "GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf";
    
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const getTransactions = async () => {
            let response;
            const options: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    //@ts-ignore
                    address: USER_WALLET
                })
            };
            try {
                response = await fetch(TRANSACTION_API_URL, options);
                if (!response.ok) throw new Error(`HTTP status: ${response.status}`);
            } catch (error) {
                console.error('Error:', error);
                return;
            }
            
            const data = await response.json();
             setTransactions(data.result)
        }
        getTransactions()
    })

    return (
        <main>
            <a href="https://quartzpay.io/">
                <Image
                    src="/quartz_logo.svg"
                    alt="Quartz"
                    height={0}
                    width={0}
                    className={styles["quartz-logo"]}
                />
            </a>
            
            <OffRamp/>

            <Transactions transactions={transactions}/>
        </main>
    )
}