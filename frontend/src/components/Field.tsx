import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Field.module.css";

interface FieldProps {
    heading: string;
    large?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Field({heading, onClick, large = false, children} : FieldProps) {
    // Get text to copy from the first child tag
    const copyTextElement = React.Children.toArray(children)[0] as ReactElement;
    let copyText = "";
    if (copyTextElement && copyTextElement.props && copyTextElement.props.children) {
        copyText = copyTextElement.props.children;
    }


    // Copy text and display feedback for set time
    const copiedDuration = 1200;

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
        if (copyText == "") return;
        navigator.clipboard.writeText(copyText);
        setDisplayCopied(true);
    }


    let className = large ? `${styles["field"]} ${styles["large"]}` : styles["field"];
    if (displayCopied) className += ` ${styles["copied"]}`
    return (
        <div className={styles["field-wrapper"]}>
            <small>{heading}</small>
            <button className={className} onClick={onClick ? onClick : handleCopy}>
                {displayCopied && <p>Copied</p>}
                {!displayCopied && children}
            </button>
        </div>
    )
}