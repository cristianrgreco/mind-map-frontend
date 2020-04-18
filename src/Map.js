import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";

export function Map() {
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const addNode = e => {
        const parents = selectedNode ? [selectedNode] : [];
        const isSelected = nodes.length === 0;

        const node = {value: '', isNew: true, isSelected, x: e.pageX, y: e.pageY, parents};

        if (nodes.length === 0) {
            setSelectedNode(node);
        }
        setNodes([...nodes, node]);
    };

    const nodesWithout = node => nodes.filter(aNode => aNode !== node);

    const setValue = node => value =>
        setNodes([...nodesWithout(node), {...node, value}]);

    const setPosition = node => (x, y) =>
        setNodes([...nodesWithout(node), {...node, x, y}]);

    const setIsNew = node => isNew =>
        setNodes([...nodesWithout(node), {...node, isNew}]);

    const setIsSelected = node => isSelected => {
        setSelectedNode(node);
        setNodes([...nodesWithout(node).map(node => ({...node, isSelected: false})), {...node, isSelected}]);
    }

    const getKey = node => `${node.x}_${node.y}`;

    return (
        <div className={styles.Map} onClick={addNode}>
            {nodes.map(node => (
                <Fragment key={getKey(node)}>
                    <Node
                        value={node.value}
                        setValue={setValue(node)}
                        x={node.x}
                        y={node.y}
                        setPosition={setPosition(node)}
                        isNew={node.isNew}
                        setIsNew={setIsNew(node)}
                        isSelected={node.isSelected}
                        setIsSelected={setIsSelected(node)}
                    />
                    {node.parents.map(parent => (
                        <Line key={`${getKey(node)}_${getKey(parent)}`} from={node} to={parent}/>
                    ))}
                </Fragment>
            ))}
        </div>
    );
}
