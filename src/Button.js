import React from "react";
import styles from "./Button.module.css";

export function Button({ children, ...props }) {
  return (
    <div className={styles.Button} {...props}>
      {children}
    </div>
  );
}
