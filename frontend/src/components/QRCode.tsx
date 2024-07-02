import Image from "next/image";
import styles from "./QRCode.module.css";

export default function QRCode() {
    return (
        <div className={styles["qr-container"]}>
            <Image
                src="/qr-placeholder.jpg"
                alt="QR code version of wallet address"
                height={250}
                width={250}
            />
        </div>
    )
}