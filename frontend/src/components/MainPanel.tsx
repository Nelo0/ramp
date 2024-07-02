import styles from "./MainPanel.module.css";

export default function MainPanel({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className={`glass ${styles["main-panel"]}`}>
            {children}
        </div>
    )
}