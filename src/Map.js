import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";

/* todo
 *   - hotkeys and instructions (map in bottom right?)
 */
export function Map({ nodeListInstance }) {
    // todo only state should be nodeList, it should return new instances and should be updated in the state
    const [nodeList] = useState(nodeListInstance);
    const [nodes, setNodes] = useState([]);
    const [, setSelectedNode] = useState(null);
    const [, setSelectedNodes] = useState([]);

    const addNode = e => {
        nodeList.addNode(e.pageX, e.pageY);

        setNodes(nodeList.nodes);
        setSelectedNode(nodeList.selectedNode);
        setSelectedNodes(nodeList.selectedNodes);
    };

    const setValue = node => value => {
        nodeList.setValue(node.id, value);
        setNodes(nodeList.nodes);
    };

    const setPosition = node => (x, y) => {
        nodeList.setPosition(node.id, x, y);
        setNodes(nodeList.nodes);
    }

    const setIsNew = node => isNew => {
        nodeList.setIsNew(node.id, isNew);
        setNodes(nodeList.nodes);
    }

    const setIsSelected = node => () => {
        nodeList.setIsSelected(node.id);

        setNodes(nodeList.nodes);
        setSelectedNode(nodeList.selectedNode);
        setSelectedNodes(nodeList.selectedNodes);
    }

    const onKeyDown = e => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            nodeList.removeNode(nodes.find(node => node.isSelected).id);

            setNodes(nodeList.nodes);
            setSelectedNode(nodeList.selectedNode);
            setSelectedNodes(nodeList.selectedNodes);

        } else if (e.key === 'Escape') {
            nodeList.cancelAddNode()

            setNodes(nodeList.nodes);
            setSelectedNode(nodeList.selectedNode);
            setSelectedNodes(nodeList.selectedNodes);
        }
    };

    const findParent = id => nodeList.nodes.find(node => node.id === id);

    return (
        <div className={styles.Map} onClick={addNode} onKeyDown={onKeyDown} tabIndex={0}>
            {nodeList.nodes.map(node => (
                <Fragment key={node.id}>
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
                    {!node.isRoot && <Line from={node} to={findParent(node.parent)}/>}
                </Fragment>
            ))}
        </div>
    );
}
