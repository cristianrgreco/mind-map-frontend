import React from "react";
import styles from './Line.module.css';

export function Line({from: {x: x1, y: y1, w: w1, h: h1}, to: {x: x2, y: y2, w: w2, h: h2}}) {
    return (
        <svg className={styles.Line}>
            <polyline
                points={`${x1 + (w1/2)},${y1 + (h1/2)} ${x2 + (w2/2)},${y2 + (h2/2)}`}
                style={{fill: 'none', stroke: '#ccc', strokeWidth: '1'}}
            />
        </svg>
    );
}
