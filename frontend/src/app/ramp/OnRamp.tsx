import MainPanel from "@/components/MainPanel/MainPanel";
import PanelSelect, { PanelRoute } from "@/components/MainPanel/PanelSelect";
import styles from "./page.module.css";
import FieldHeading from "@/components/Field/FieldHeading";
import Field from "@/components/Field/Field";
import Image from "next/image";
import Tooltip from "@/components/Tooltip";

interface OnRampProps {
    userWallet: string; //TODO - Switch to Address type?
    setRoute: (route: PanelRoute) => void;
}

export default function OnRamp({userWallet, setRoute}: OnRampProps) {
    const IBAN = "tmp_LT121000011101001000";
    const BIC = "tmp_HABAEE2X";
    const NAME = "tmp_Quartz UAB";
    const PAYEE_ADDRESS = "tmp_Katedros a. 4, 01143 Vilnius, Lithuania";
    const BANK_ADDRESS = "tmp_Konstitucijos 20A, Vilnius, Lithuania";

    return (
        <MainPanel>
            <PanelSelect selected={PanelRoute.ON} setRoute={setRoute}/>

            <div className={styles["heading-wrapper"]}>
                <h1 className={styles["heading"]}>Deposit Addresses</h1>
                <h2 className={`light ${styles["subheading"]}`}>Convert fiat to USDC</h2>
            </div>

            <div className={`${styles["panel-content"]} ${styles["justify-top"]}`}>
                <div>
                    <FieldHeading heading={"IBAN"}/>
                    <Field copyText={IBAN}>
                        <p>{IBAN}</p>
                        <Image
                            src="/copy.svg"
                            alt="Copy"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>

                <div>
                    <FieldHeading heading={"BIC"}/>
                    <Field copyText={BIC}>
                        <p>{BIC}</p>
                        <Image
                            src="/copy.svg"
                            alt="Copy"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>

                <div>
                    <FieldHeading heading={"Payee's name"}/>
                    <Field copyText={NAME}>
                        <p>{NAME}</p>
                        <Image
                            src="/copy.svg"
                            alt="Copy"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>

                <div>
                    <FieldHeading heading={"Payee's address"}/>
                    <Field copyText={PAYEE_ADDRESS}>
                        <p>{PAYEE_ADDRESS}</p>
                        <Image
                            src="/copy.svg"
                            alt="Copy"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>

                <div>
                    <FieldHeading heading={"Bank's address"}/>
                    <Field copyText={BANK_ADDRESS}>
                        <p>{BANK_ADDRESS}</p>
                        <Image
                            src="/copy.svg"
                            alt="Copy"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>

                <div>
                    <FieldHeading heading={"With reference number"} bold={true}>
                        <Tooltip src={"./tooltip_alert.svg"} alt={"!"}>
                            <small>
                                You must include the reference code exactly when making a bank transfer, or your funds may not be processed correctly.
                            </small>
                        </Tooltip>
                    </FieldHeading>
                    <Field copyText={userWallet} growText={true} accent={true}>
                        <p>{userWallet}</p>
                        <Image
                            src="/copy_accent.svg"
                            alt="Copy"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>
            </div>
        </MainPanel>
    )
}