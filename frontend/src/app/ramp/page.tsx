"use client";

import MainPanel from "@/components/MainPanel";
import Image from "next/image";
import styles from "./page.module.css";
import OffRamp from "./OffRamp";

export default function Ramp() {
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
        </main>
    )
}