import Image from "next/image";
import styles from "./NavBar.module.css";

export enum NavBarRoute {
    OFF = "Off-ramp",
    ON = "On-ramp",
    ACCOUNT = "Account"
}

interface NavBarProps {
    selected: NavBarRoute;
}

export default function NavBar({selected}: NavBarProps) {
    const offRamp = (selected === NavBarRoute.OFF);
    const onRamp = (selected === NavBarRoute.ON);
    const account = (selected === NavBarRoute.ACCOUNT);

    return (
        <div className={styles["nav"]}>
            <div className={styles["ramps"]}>
                <div className={`${styles["ramp-button"]} ${offRamp ? "active" : ""}`}>
                    <p>Off-ramp</p>
                </div>
                <div className={`${styles["ramp-button"]} ${onRamp ? "active" : ""}`}>
                    <p>On-ramp</p>
                </div>
            </div>
            <div className={`${styles["account"]} ${account ? "active" : ""}`}>
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
            </div>
        </div>
    )
}