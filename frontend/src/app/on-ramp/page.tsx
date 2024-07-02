import MainPanel from "@/components/MainPanel";
import Image from "next/image";
import styles from "./page.module.css";

export default function OnRamp() {
    return (
        <main>
            <a href="https://quartzpay.io/">
                <Image
                    src="quartz_logo.svg"
                    alt="Quartz"
                    height={0}
                    width={0}
                    className={"quartz-logo"}
                />
            </a>
            
            <MainPanel>
                <h3>Deposit Addresses</h3>
                <p></p>
            </MainPanel>
        </main>
    )
}