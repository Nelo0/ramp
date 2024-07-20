"use client";

import Image from "next/image";
import styles from "./page.module.css";
import OffRamp from "./OffRamp";
import Transactions from "./Transactions";
import { useEffect, useState } from "react";
import { Status, Transaction } from "@/model/Transaction";
import { PanelRoute } from "@/components/MainPanel/PanelSelect";
import Account from "./Account";
import OnRamp from "./OnRamp";

export default function Ramp() {
    const ADDRESS_SNS = "quartzpay.sol";
    const ADDRESS_WALLET = "CHS52vBAVvCNAmy2jjtWWcVstwATaK37TyjwXTHzem1Q"; // TODO - Replace with Solana address type? Or check it's a valid address?
    
    // TODO - Remove hardcoded user info
    const USER_WALLET = "GgohWvPKDBDgDmkX17GrNMbmAiVy7wQVqx1yzLeG6VGf"; // TODO - Replace with Solana address type? Or check it's a valid address?
    const USER_NAME = "Iarla Crewe";
    const USER_IBAN = "ES9121000418450200051332";
    const USER_BANK_HOLDER = "Iarla Crewe";
    const USER_BANK_NAME = "Santander";
    const USER_BANK_ADDRESS = 
        `Av. del Port, 131,
        Camins al Grau,
        46022 Valencia,
        Spain`;

    // TODO - Implement editing account details
    const editUserWallet = () => {console.log("Edit wallet")};
    const editUserName = () => {console.log("Edit name")};
    const editUserBank = () => {console.log("Edit bank")};

    const TRANSACTION_API_URL = "http://localhost:3001/api/txHistory";
    const TRANSACTION_REFRESH_SPEED = 5000;

    const [route, setRoute] = useState(PanelRoute.OFF);
    
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
        //fetchTransactions();
        const intervalId = setInterval(fetchTransactions, TRANSACTION_REFRESH_SPEED);
            return () => clearInterval(intervalId);
    }, [])

    return (
        <main>
            <div className={styles["nav"]}>
                <a href="https://quartzpay.io/">
                    <Image
                        src="/quartz_logo.svg"
                        alt="Quartz"
                        height={74.29}
                        width={180}
                        className={styles["quartz-logo"]}
                    />
                </a>
                <div className={styles["nav-links"]}>
                    {/* TODO - Add links to Scout, Card */}
                </div>
            </div>
            
            {(route === PanelRoute.OFF) &&
                <OffRamp 
                    addressSns={ADDRESS_SNS} 
                    addressWallet={ADDRESS_WALLET} 
                    setRoute={(route) => setRoute(route)}
                />
            }
            
            {(route === PanelRoute.ON) &&
                <OnRamp 
                    userWallet={USER_WALLET}
                    setRoute={(route) => setRoute(route)}
                />
            }

            {(route === PanelRoute.ACCOUNT) &&
                <Account 
                    userWallet={USER_WALLET}
                    name={USER_NAME}
                    iban={USER_IBAN}
                    bankHolder={USER_BANK_HOLDER}
                    bankName={USER_BANK_NAME}
                    bankAddress={USER_BANK_ADDRESS}
                    onEditWallet={editUserWallet}
                    onEditName={editUserName}
                    onEditBank={editUserBank}
                    setRoute={(route) => setRoute(route)}
                />
            }

            <Transactions transactions={transactions}/>
        </main>
    )
}