import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Field.module.css";
import Image from "next/image";

interface FieldProps {
    large?: boolean;
    copyText?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Field({large = false, copyText, onClick, children} : FieldProps) {
    const copiedDuration = 1200;

    // Copy text and display feedback for set time
    const [displayCopied, setDisplayCopied] = useState(false);
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (displayCopied) {
            timer = setTimeout(() => {
                setDisplayCopied(false);
            }, copiedDuration);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [displayCopied])

    const handleCopy = () => {
        if (copyText == undefined) return;
        navigator.clipboard.writeText(copyText);
        setDisplayCopied(true);
    }


    let className = large ? `${styles["field"]} ${styles["large"]}` : styles["field"];
    if (displayCopied) className += ` ${styles["copied"]}`
    return (
        <button className={className} onClick={onClick ? onClick : handleCopy}>
            {displayCopied && 
                <p className="light">Copied</p>
            }
            {!displayCopied && children}
        </button>
    )
}