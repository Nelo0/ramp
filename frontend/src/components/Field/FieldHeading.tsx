import Image from "next/image";
import React, { useState } from "react";
import styles from "./FieldHeading.module.css";

interface FieldHeadingProps {
    heading: string;
    bold?: boolean;
    children?: React.ReactNode;
}

export default function FieldHeading({heading, bold, children}: FieldHeadingProps) {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    return (
        <div className={styles["field-heading"]}>
            <small className={bold ? "bold" : ""}>{heading}</small>
            {children}
        </div>
    )
}