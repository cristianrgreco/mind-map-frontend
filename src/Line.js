import React from "react";
import styles from './Line.module.css';

export function Line({from, to}) {
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;

    console.log(`${x1},${y1} ${x2},${y2}`);

    return (
        <svg className={styles.Line}>
            <polyline
                points={`${x1},${y1} ${x2},${y2}`}
                style={{fill: 'none', stroke: '#ccc', strokeWidth: '1'}}
            />
        </svg>
    );
}
