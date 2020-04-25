import React from "react";
import styles from "./Square.module.css";

export function Square({rect}) {
    return (
        <svg className={styles.Square}>
            <polyline
                points={`${rect.x},${rect.y} ${rect.x},${rect.y + rect.h} ${rect.x + rect.w},${rect.y + rect.h} ${rect.x + rect.w},${rect.y} ${rect.x},${rect.y}`}
                style={{fill: 'none', stroke: '#ccc', strokeWidth: '15'}}
            />
        </svg>
    );
}