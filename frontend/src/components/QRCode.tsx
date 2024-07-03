import Image from "next/image";
import styles from "./QRCode.module.css";

interface QRCodeProps {
    address: string; // TODO - Replace with Solana wallet type? Or insure it's a valid wallet?
}

export default function QRCode({address}: QRCodeProps) {
    // TODO - remove placeholder image

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