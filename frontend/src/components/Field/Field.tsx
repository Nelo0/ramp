import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from "./Field.module.css";
import Image from "next/image";

interface FieldProps {
    large?: boolean;
    growText?: boolean;
    accent?: boolean;
    copyText?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Field({large, growText, accent, copyText, onClick, children} : FieldProps) {
    const COPIED_DURATION = 1200;
    const MIN_FONT_SIZE = 9;
    const MAX_FONT_SIZE = 16.8;

    const [displayCopied, setDisplayCopied] = useState(false);
    const containerRef = useRef<HTMLButtonElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Scale text to fit container
    useEffect(() => {
        const resizeText = () => {
            if (!containerRef.current || !wrapperRef.current) return;

            const wrapper = wrapperRef.current;
            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const text = wrapper.querySelector("p");
            if (!text) return;

            let fontSize = MIN_FONT_SIZE;
            text.style.fontSize = `${fontSize}px`
            // text.style.visibility = 'hidden'; // Hide text until correct size is found

            while (wrapper.scrollWidth <= containerWidth && wrapper.scrollHeight <= containerHeight && fontSize < MAX_FONT_SIZE) {
                fontSize += 0.2;
                text.style.fontSize = `${fontSize}px`;
            }

            // Adjust to fit perfectly and make text visible
            text.style.fontSize = `${fontSize - 1}px`;
            // text.style.visibility = 'visible';
        };

        if (growText) {
            resizeText();
            window.addEventListener('resize', resizeText);

            return () => window.removeEventListener('resize', resizeText);
        }
    }, [children, growText])


    // Copy text and display feedback for set time
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (displayCopied) {
            timer = setTimeout(() => {
                setDisplayCopied(false);
            }, COPIED_DURATION);
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


    let className = `${styles["field"]}`;
    if (large) className += ` ${styles["large"]}`;
    if (displayCopied) className += ` ${styles["copied"]}`;
    if (accent) className += ` ${styles["accent"]}`;

    return (
        <button ref={containerRef} className={className} onClick={onClick ? onClick : handleCopy}>
            {displayCopied && 
                <p className="light">Copied</p>
            }
            <div ref={wrapperRef} className={`${styles["field-content-wrapper"]} ${displayCopied ? styles["hidden"] : ""}`}>
                {children}
            </div>
        </button>
    )
}