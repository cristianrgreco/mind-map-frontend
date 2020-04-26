import React from "react";
import { Link } from "react-router-dom";
import styles from "./MapControls.module.css";
import linkStyles from "./Link.module.css";
import { Button } from "./Button";

export function MapControls() {
  return (
    <div className={styles.Controls}>
      <div className={styles.ControlItem}>
        <Link className={linkStyles.NoTextDecoration} to="/">
          <Button onClick={(e) => e.stopPropagation()}>
            <span>New</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
