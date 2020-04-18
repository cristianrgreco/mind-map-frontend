import React from "react";
import styles from './Line.module.css';

export function Line({from: {x: x1, y: y1}, to: {x: x2, y: y2}}) {
    return (
        <svg className={styles.Line}>
            <polyline
                points={`${x1},${y1} ${x2},${y2}`}
                style={{fill: 'none', stroke: '#ccc', strokeWidth: '1'}}
            />
        </svg>
    );
}
