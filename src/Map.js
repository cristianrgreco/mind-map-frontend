import React, {useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";

export function Map({ nodes = [] }) {
    const [_nodes, setNodes] = useState(nodes);

    const addNode = e => {
        setNodes([..._nodes, <Node isNew={true} x={e.pageX} y={e.pageY}/>]);
    };

    return (
        <div className={styles.Board} onClick={addNode}>
            {_nodes}
        </div>
    );
}
