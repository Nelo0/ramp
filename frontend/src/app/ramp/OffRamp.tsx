import QRCode from "@/components/QRCode";
import styles from "./page.module.css";
import Field from "@/components/Field/Field";
import MainPanel from "@/components/MainPanel";
import Image from "next/image";
import { useState } from "react";
import { hashToDisplayString } from "@/utils/solanaUtils";
import FieldHeading from "@/components/Field/FieldHeading";
import Tooltip from "@/components/Tooltip";

export default function OffRamp() {
    // TODO -> keep this constants somewhere better
    const ADDRESS_SNS = "quartzpay.sol";
    const ADDRESS_WALLET = "CHS52vBAVvCNAmy2jjtWWcVstwATaK37TyjwXTHzem1Q"; // TODO - Replace with Solana address type? Or check it's a valid address?

    const [useSNS, setUseSNS] = useState(true);
    const switchSNSText = useSNS ? "Switch to wallet address" : "Switch to SNS";
    const addressHeading = useSNS ? "Solana Name Service" : "Solana wallet address";
    const addressCopy = useSNS ? ADDRESS_SNS : ADDRESS_WALLET;
    const addressDisplay = useSNS ? ADDRESS_SNS : hashToDisplayString(ADDRESS_WALLET);

    return (
        <MainPanel>
            <div>
                <h1 className={styles["heading"]}>Deposit Addresses</h1>
                <h2 className={`light ${styles["subheading"]}`}>Convert crypto to fiat</h2>
            </div>

            <QRCode address={ADDRESS_WALLET}/>

            <FieldHeading heading={addressHeading}>
                {useSNS && 
                    <Tooltip src={"/tooltip_help.svg"} alt={"?"}>
                        <small>
                            <a href="https://www.sns.id/" target="_blank">Solana Name Service</a> is a way to represent wallet addresses as easy-to-remember domains. “quartzpay.sol” is our SNS domain.
                        </small>
                    </Tooltip>
                }
            </FieldHeading>

            <Field copyText={addressCopy} large={true}>
                <div className={styles["sns-tooltip"]}>
                    <p>{addressDisplay}</p>
                </div>
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