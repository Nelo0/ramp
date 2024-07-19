"use client";

import Image from "next/image";
import styles from "./page.module.css";
import OffRamp from "./OffRamp";
import Transactions from "./Transactions";
import { useEffect, useState } from "react";
import { Status, Transaction } from "@/model/Transaction";
import { NavBarRoute } from "@/components/NavBar";
import Account from "./Account";
import OnRamp from "./OnRamp";

export default function Ramp() {
    const TRANSACTION_API_URL = "http://localhost:3001/api/txHistory";
    const USER_WALLET = "GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf";
    const TRANSACTION_REFRESH_SPEED = 5000;

    const [route, setRoute] = useState(NavBarRoute.OFF);
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        let response;
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: USER_WALLET
            })
        };
        try {
            response = await fetch(TRANSACTION_API_URL, options);
            if (!response.ok) throw new Error(`HTTP status: ${response.status}`);

            const data = await response.json();

            const transactionObjs: Transaction[] = data.result.map((transaction: any) => {
                return {
                    ...transaction,
                    // time: new Date(transaction.time),  // TODO - Convert to date object
                    status: transaction.status as Status
                };
            });
            console.log(transactionObjs[0]);

            setTransactions(transactionObjs);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        fetchTransactions();
        // const intervalId = setInterval(fetchTransactions, TRANSACTION_REFRESH_SPEED);
        // return () => clearInterval(intervalId);
    }, [])

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
            
            {(route === NavBarRoute.OFF) &&
                <OffRamp setRoute={(route) => setRoute(route)}/>
            }
            
            {(route === NavBarRoute.ON) &&
                <OnRamp setRoute={(route) => setRoute(route)}/>
            }

            {(route === NavBarRoute.ACCOUNT) &&
                <Account setRoute={(route) => setRoute(route)}/>
            }

            <Transactions transactions={transactions}/>
        </main>
    )
}