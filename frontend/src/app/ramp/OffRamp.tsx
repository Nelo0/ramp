import QRCode from "@/components/QRCode";
import styles from "./page.module.css";
import Field from "@/components/Field/Field";
import MainPanel from "@/components/MainPanel/MainPanel";
import Image from "next/image";
import { useState } from "react";
import { hashToDisplayString } from "@/utils/solanaUtils";
import FieldHeading from "@/components/Field/FieldHeading";
import Tooltip from "@/components/Tooltip";
import PanelSelect, { PanelRoute } from "@/components/MainPanel/PanelSelect";

interface OffRampProps {
    addressSns: string,
    addressWallet: string, // TODO - Change to Token
    setRoute: (route: PanelRoute) => void;
}

export default function OffRamp({addressSns, addressWallet, setRoute}: OffRampProps) {
    const [useSNS, setUseSNS] = useState(true);
    const switchSNSText = useSNS ? "Switch to wallet address" : "Switch to SNS";
    const addressHeading = useSNS ? "Solana Name Service" : "Solana wallet address";
    const addressCopy = useSNS ? addressSns : addressWallet;
    const addressDisplay = useSNS ? addressSns : hashToDisplayString(addressWallet);

    return (
        <MainPanel>
            <PanelSelect selected={PanelRoute.OFF} setRoute={setRoute}/>

            <div className={styles["heading-wrapper"]}>
                <h1 className={styles["heading"]}>Deposit Addresses</h1>
                <h2 className={`light ${styles["subheading"]}`}>Convert USDC to fiat</h2>
            </div>

            <div className={styles["panel-content"]}>
                <QRCode address={addressWallet}/>

                <div>
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
                        <p>{addressDisplay}</p>
                        <Image
                            src="/copy.svg"
                            alt="Copy"
                            height={36}
                            width={36}
                        />
                    </Field>
                </div>
                
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