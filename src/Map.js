import React, {useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";

export function Map() {
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const addNode = e => {
        const node = {isNew: true, x: e.pageX, y: e.pageY};
        if (nodes.length === 0) {
            setSelectedNode(node);
        }
        setNodes([...nodes, node]);
    };

    return (
        <div className={styles.Board} onClick={addNode}>
            {nodes.map(node => (
                <Node
                    isSelected={node === selectedNode}
                    setIsSelected={() => setSelectedNode(node)}
                    isNew={node.isNew}
                    x={node.x}
                    y={node.y}
                />
            ))}
        </div>
    );
}
