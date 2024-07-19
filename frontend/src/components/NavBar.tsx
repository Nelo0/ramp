import Image from "next/image";
import styles from "./NavBar.module.css";

export enum NavBarRoute {
    OFF = "Off-ramp",
    ON = "On-ramp",
    ACCOUNT = "Account"
}

interface NavBarProps {
    selected: NavBarRoute;
    setRoute: (route: NavBarRoute) => void;
}

export default function NavBar({selected, setRoute}: NavBarProps) {
    const offRamp = (selected === NavBarRoute.OFF);
    const onRamp = (selected === NavBarRoute.ON);
    const account = (selected === NavBarRoute.ACCOUNT);

    return (
        <div className={styles["nav"]}>
            <div className={styles["nav-section"]}>
                <button 
                    onClick={() => setRoute(NavBarRoute.OFF)} 
                    className={`${styles["ramp-button"]} ${offRamp ? styles["active"] : styles["inactive"]}`}
                >
                    <p>Off-ramp</p>
                </button>
                <button 
                    onClick={() => setRoute(NavBarRoute.ON)} 
                    className={`${styles["ramp-button"]} ${onRamp ? styles["active"] : styles["inactive"]}`}
                >
                    <p>On-ramp</p>
                </button>
            </div>
            <button 
                onClick={() => setRoute(NavBarRoute.ACCOUNT)} 
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