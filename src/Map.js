import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";

/* todo
 *   - hotkeys and instructions (map in bottom right?)
 */

export function Map() {
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const createId = () => `id-${(new Date()).getTime()}`;

    const addNode = e => {
        if (nodes.some(node => node.isNew)) {
            return;
        }

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

    const replaceNode = (nodes, oldNode, newNode) => {
        return nodes.map(node => {
            const returnNode = node.id === oldNode.id ? newNode : node;
            return replaceParent(returnNode, oldNode, newNode);
        });
    };

    const replaceParent = (node, oldParent, newParent) => {
        return {...node, parents: node.parents.map(parent => parent.id === oldParent.id ? newParent : parent)};
    };

    const setValue = node => value => {
        setNodes(replaceNode(nodes, node, {...node, value}));
    };

    const setPosition = node => (x, y) => {
        setNodes(replaceNode(nodes, node, {...node, x, y}));
    }

    const setIsNew = node => isNew => {
        setNodes(replaceNode(nodes, node, {...node, isNew}));
    }

    const setIsSelected = node => isSelected => {
        const newNode = {...node, isSelected};
        setSelectedNode(newNode);
        setNodes(replaceNode(nodes.map(node => ({...node, isSelected: false})), node, newNode));
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
