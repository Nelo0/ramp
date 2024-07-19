import Image from "next/image";
import styles from "./PanelSelect.module.css";

export enum PanelRoute {
    OFF = "Off-ramp",
    ON = "On-ramp",
    ACCOUNT = "Account"
}

interface PanelSelectProps {
    selected: PanelRoute;
    setRoute: (route: PanelRoute) => void;
}

export default function PanelSelect({selected, setRoute}: PanelSelectProps) {
    const offRamp = (selected === PanelRoute.OFF);
    const onRamp = (selected === PanelRoute.ON);
    const account = (selected === PanelRoute.ACCOUNT);

    return (
        <div className={styles["nav"]}>
            <div className={`${styles["nav-section"]} ${styles["ramps"]}`}>
                <button 
                    onClick={() => setRoute(PanelRoute.OFF)} 
                    className={`${styles["ramp-button"]} ${offRamp ? styles["active"] : styles["inactive"]}`}
                >
                    <p>Off-ramp</p>
                </button>
                <button 
                    onClick={() => setRoute(PanelRoute.ON)} 
                    className={`${styles["ramp-button"]} ${onRamp ? styles["active"] : styles["inactive"]}`}
                >
                    <p>On-ramp</p>
                </button>
            </div>
            <button 
                onClick={() => setRoute(PanelRoute.ACCOUNT)} 
                className={`${styles["nav-section"]} ${styles["account"]} ${account ? styles["active"] : styles["inactive"]}`}
            >
                {!account &&
                    <Image
                        src="profile.svg"
                        alt="Account"
                        height={0}
                        width={0}
                    />
                }
                {account &&
                    <Image
                        src="profile_selected.svg"
                        alt="Account"
                        height={0}
                        width={0}
                    />
                }
            </button>
        </div>
    )
}