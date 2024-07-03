"use client";

import MainPanel from "@/components/MainPanel";
import Image from "next/image";
import styles from "./page.module.css";
import QRCode from "@/components/QRCode";
import Field from "@/components/Field";

export default function OnRamp() {
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
            
            <MainPanel>
                <div>
                    <h1 className={styles["heading"]}>Deposit Addresses</h1>
                    <h2 className={styles["subheading"]}>Convert crypto to fiat</h2>
                </div>

                <QRCode/>

                <Field heading={"Solana Name Service"} large={true}>
                    <p>quartzpay.sol</p>
                    <Image
                        src="/copy.svg"
                        alt="Copy"
                        height={0}
                        width={0}
                    />
                </Field>
                
                <div className={styles["buttons-container"]}>
                    <button
                        className={styles["button-link"]}
                        onClick={() => console.log("click")}
                    >
                        Switch to wallet address
                    </button>
                </div>
            </MainPanel>
        </main>
    )
}