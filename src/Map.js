import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";

/* todo
 *   - delete using hotkeys
 *   - if node is being edited, cannot add a new one, pressing esc cancels creating the node
 *   - edit text
 *   - hotkeys and instructions (map in bottom right?)
 */

export function Map() {
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const createId = () => `id-${(new Date()).getTime()}`;

    const addNode = e => {
        const parents = selectedNode ? [selectedNode] : [];
        const isSelected = nodes.length === 0;

        const node = {
            id: createId(),
            value: '',
            isNew: true,
            isSelected,
            x: e.pageX,
            y: e.pageY,
            parents
        };

        if (nodes.length === 0) {
            setSelectedNode(node);
        }

        setNodes([...nodes, node]);
    };

    const replaceParent = (node, oldParent, newParent) => ({
        ...node,
        parents: node.parents.map(parent => parent.id === oldParent.id ? newParent : parent)
    });

    const setValue = node => value => {
        const newNode = {...node, value};
        const updatedNodes = nodes.map(aNode => {
            const returnNode = aNode.id === node.id ? newNode : aNode;
            return replaceParent(returnNode, node, newNode);
        });
        setNodes(updatedNodes);
    };

    const setPosition = node => (x, y) => {
        const newNode = {...node, x, y};
        const updatedNodes = nodes.map(aNode => {
            const returnNode = aNode.id === node.id ? newNode : aNode;
            return replaceParent(returnNode, node, newNode);
        });
        setNodes(updatedNodes);
    }

    const setIsNew = node => isNew => {
        const newNode = {...node, isNew};
        const updatedNodes = nodes.map(aNode => {
            const returnNode = aNode.id === node.id ? newNode : aNode;
            return replaceParent(returnNode, node, newNode);
        });
        setNodes(updatedNodes);
    }

    const setIsSelected = node => isSelected => {
        const newNode = {...node, isSelected};
        const updatedNodes = nodes.map(aNode => {
            const returnNode = aNode.id === node.id ? newNode : {...aNode, isSelected: false};
            return replaceParent(returnNode, node, newNode);
        });

        setSelectedNode(newNode);
        setNodes(updatedNodes);
    }

    const removeNode = () => {
        const node = nodes.find(node => node.isSelected);
        const updatedNodes = nodes.filter(aNode => aNode.id !== node.id);

        // todo remove node from parents of all nodes. If node has empty parents, also remove
        // todo setSelectedNode(previouslySelectedNode);

        setNodes(updatedNodes);
    };

    const cancelAddNode = () => {
        const node = nodes.find(node => node.isNew);

        if (node) {
            const updatedNodes = nodes.filter(aNode => aNode.id !== node.id);

            if (updatedNodes.length === 0) {
                setSelectedNode(null);
            }

            setNodes(updatedNodes);
        }
    };

    const onKeyDown = e => {
        console.log(e.key);
        if (e.key === 'Backspace' || e.key === 'Delete') {
            removeNode();
        } else if (e.key === 'Escape') {
            cancelAddNode();
        }
    };

    return (
        <div className={styles.Map} onClick={addNode} onKeyDown={onKeyDown} tabIndex={0}>
            {nodes.map(node => (
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
                    {node.parents.map(parent => (
                        <Line key={`${node.id}_${parent.id}`} from={node} to={parent}/>
                    ))}
                </Fragment>
            ))}
        </div>
    );
}
