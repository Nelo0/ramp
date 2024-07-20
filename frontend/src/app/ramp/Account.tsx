import MainPanel from "@/components/MainPanel/MainPanel";
import PanelSelect, { PanelRoute } from "@/components/MainPanel/PanelSelect";
import styles from "./page.module.css";
import Image from "next/image";
import Field from "@/components/Field/Field";
import FieldHeading from "@/components/Field/FieldHeading";

interface AccountProps {
    userWallet: string; //TODO - Switch to Address type?
    name: string;
    iban: string;
    bankHolder: string;
    bankName: string;
    bankAddress: string;
    onEditWallet: () => void;
    onEditName: () => void;
    onEditBank: () => void;
    setRoute: (route: PanelRoute) => void;
}

export default function Account({
    userWallet, name, iban, bankHolder, bankName, bankAddress, onEditWallet, onEditName, onEditBank, setRoute
}: AccountProps) {
    return (
        <MainPanel>
            <PanelSelect selected={PanelRoute.ACCOUNT} setRoute={setRoute}/>

            <div className={styles["heading-wrapper"]}>
                <h1 className={styles["heading"]}>Account Details</h1>
            </div>

            <div className={`${styles["panel-content"]} ${styles["justify-top"]}`}>
                <div>
                    <FieldHeading heading={"Solana wallet address"}/>
                    <Field growText={true} accent={true} onClick={onEditWallet}>
                        <p>{userWallet}</p>
                        <Image
                            src="/edit_accent.svg"
                            alt="Edit"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>

                <div>
                    <FieldHeading heading={"Legal name"}/>
                    <Field onClick={onEditName}>
                        <p>{name}</p>
                        <Image
                            src="/edit.svg"
                            alt="Edit"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>

                <div>
                    <FieldHeading heading={"Bank details"}/>
                    <Field onClick={onEditBank}>
                        <div className={styles["bank-details"]}>
                            <small className="light">IBAN</small> <small>{iban}</small>
                            <small className="light">Bank holder name</small> <small>{bankHolder}</small>
                            <small className="light">Bank name</small> <small>{bankName}</small>
                            <small className="light">Bank address</small> <small>{bankAddress}</small>
                        </div>
                        <Image
                            src="/edit.svg"
                            alt="Edit"
                            height={23}
                            width={23}
                        />
                    </Field>
                </div>
            </div>
        </MainPanel>
    )
}