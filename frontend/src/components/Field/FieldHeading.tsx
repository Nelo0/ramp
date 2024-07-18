import Image from "next/image";
import React, { useState } from "react";
import styles from "./FieldHeading.module.css";

interface FieldHeadingProps {
    heading: string;
    children?: React.ReactNode;
}

export default function FieldHeading({heading, children}: FieldHeadingProps) {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    return (
        <div className={styles["field-heading"]}>
            <small>{heading}</small>
            {children}
        </div>
    )
}