import QRCode from "@/components/QRCode";
import styles from "./page.module.css";
import Field from "@/components/Field";
import MainPanel from "@/components/MainPanel";
import Image from "next/image";
import { useState } from "react";

export default function OffRamp() {
    const ADDRESS_SNS = "quartzpay.sol";
    const ADDRESS_WALLET = "ABJLK3RrRwG8LdvQiSLV9ZG4Ca8L5pjDN3Gjganz3BTa";

    const [useSNS, setUseSNS] = useState(true);
    const switchSNSText = useSNS ? "Switch to wallet address" : "Switch to SNS";
    const addressHeading = useSNS ? "Solana Name Service" : "Solana wallet address";

    
    const addressWalletDisplay = ADDRESS_WALLET.slice(0, 4) + "..." + ADDRESS_WALLET.slice(-4);
    const addressCopy = useSNS ? ADDRESS_SNS : ADDRESS_WALLET;
    const addressDisplay = useSNS ? ADDRESS_SNS : addressWalletDisplay;

    return (
        <MainPanel>
            <div>
                <h1 className={styles["heading"]}>Deposit Addresses</h1>
                <h2 className={styles["subheading"]}>Convert crypto to fiat</h2>
            </div>

            <QRCode/>

            <Field heading={addressHeading} copyText={addressCopy} large={true}>
                <p>{addressDisplay}</p>
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
                    onClick={() => setUseSNS(!useSNS)}
                >
                    {switchSNSText}
                </button>
            </div>
        </MainPanel>
    )
}