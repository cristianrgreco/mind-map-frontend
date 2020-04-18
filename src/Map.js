import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";

export function Map() {
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const addNode = e => {
        const parents = selectedNode ? [selectedNode] : [];
        const node = {x: e.pageX, y: e.pageY, parents};

        if (nodes.length === 0) {
            setSelectedNode(node);
        }
        setNodes([...nodes, node]);
    };

    const getKey = node => `${node.x}_${node.y}`;

    const setPosition = node => (x, y) => {
        const newNodes = [...nodes.filter(aNode => aNode !== node), {...node, x, y}];
        setNodes(newNodes);
    };

    return (
        <div className={styles.Map} onClick={addNode}>
            {nodes.map(node => (
                <Fragment key={getKey(node)}>
                    <Node isSelected={node === selectedNode}
                          setIsSelected={() => setSelectedNode(node)}
                          isNew={node.isNew}
                          x={node.x}
                          y={node.y}
                          setPosition={setPosition(node)}
                    />
                    {node.parents.map(parent => (
                        <Line key={`${getKey(node)}_${getKey(parent)}`} from={node} to={parent}/>
                    ))}
                </Fragment>
            ))}
        </div>
    );
}
