import React from "react";
import {Link} from "react-router-dom";
import styles from "./MapControls.module.css";

export function MapControls({isEmpty}) {
    return (
        <div className={styles.Controls}>
            {!isEmpty && (
                <div className={styles.ControlItem}>
                    <Link className={styles.Link} to="/">
                        <div className={styles.Button} onClick={e => e.stopPropagation()}>
                            <span>New</span>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}