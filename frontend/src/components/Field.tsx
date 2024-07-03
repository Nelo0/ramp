import styles from "./Field.module.css";

interface FieldProps {
    heading: string;
    large?: boolean;
    children: React.ReactNode;
}

export default function Field({heading, large = false, children} : FieldProps) {
    const className = large ? `${styles["field"]} ${styles["large"]}` : styles["field"];
    return (
        <div className={styles["field-wrapper"]}>
            <small>{heading}</small>
            <div className={className}>
                {children}
            </div>
        </div>
    )
}