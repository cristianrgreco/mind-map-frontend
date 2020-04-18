import React from "react";
import styles from './Line.module.css';

export function Line({from, to}) {
    const {x: x1, y: y1} = from;
    const {x: x2, y: y2} = to;

    return (
        <svg className={styles.Line}>
            <polyline
                points={`${x1},${y1} ${x2},${y2}`}
                style={{fill: 'none', stroke: '#ccc', strokeWidth: '1'}}
            />
        </svg>
    );
}
