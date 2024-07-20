import Image from "next/image";
import { ReactNode, useState } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
    src: string;
    alt: string;
    children: ReactNode;
}

export default function Tooltip({src, alt, children}: TooltipProps) {
    const [enabled, setEnabled] = useState(false);

    return (
        <div 
            className={styles["tooltip-button"]} 
            onMouseEnter={() => setEnabled(true)}
            onMouseLeave={() => setEnabled(false)}
        >
            <Image
                src={src}
                alt={alt}
                height={13}
                width={13}
            />
            {enabled &&
                <div className={styles["tooltip-wrapper"]}>
                    <div className={`glass ${styles["tooltip"]}`}>
                        {children}
                    </div>
                </div>
            }
        </div>
    )
}