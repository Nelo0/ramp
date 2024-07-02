"use client";

import MainPanel from "@/components/MainPanel";
import Image from "next/image";
import styles from "./page.module.css";
import QRCode from "@/components/QRCode";

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
                <h1 className={styles["heading"]}>Deposit Addresses</h1>
                <h2 className={styles["subheading"]}>Convert crypto to fiat</h2>

                <div className={styles["content-container"]}>
                    <QRCode/>

                    <button
                        className={styles["button-link"]}
                        onClick={() => console.log("foo")}
                    >
                        Switch to wallet address
                    </button>

                    <button>
                        Test Button
                    </button>
                </div>
            </MainPanel>
        </main>
    )
}