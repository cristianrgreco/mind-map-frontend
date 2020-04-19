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
    const [selectedNodes, setSelectedNodes] = useState([]);

    const createId = () => `id-${Date.now()}`;

    const addSelectedNode = selectedNode => {
        if (selectedNodes.length === 0) {
            setSelectedNodes([selectedNode]);
        } else {
            const lastSelectedNode = selectedNodes[selectedNodes.length - 1];
            if (lastSelectedNode.id !== selectedNode.id) {
                setSelectedNodes([...selectedNodes, selectedNode]);
            }
        }
    };

    const addNode = e => {
        if (nodes.some(node => node.isNew)) {
            return;
        }

        // todo can there be more than one parent?
        const parents = selectedNode ? [selectedNode] : [];
        const isSelected = nodes.length === 0;

        const node = {
            id: createId(),
            value: '',
            isNew: true,
            isRoot: nodes.length === 0,
            isSelected,
            x: e.pageX,
            y: e.pageY,
            parents
        };

        if (nodes.length === 0) {
            setSelectedNode(node);
            addSelectedNode(node);
        }

        setNodes([...nodes, node]);
    };

    // todo also need to replace selectedNodes
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
        addSelectedNode(newNode);
        setNodes(replaceNode(nodes.map(node => ({...node, isSelected: false})), node, newNode));
    }

    const removeNode = (node, nodes) => {
        const updatedNodes = nodes
            .map(aNode => ({...aNode, parents: aNode.parents.filter(aParent => aParent.id !== node.id)}))
            .filter(aNode => aNode.id !== node.id);

        setNodes(updatedNodes);


        // todo(bug): when removing selected node, the previously selected node doesn't become re-selected
        // todo(feat): do nodes need to be removed from the selected nodes list? It's becoming cumbersome removing them now

        if (node.isSelected) {
            console.log('Remove selected node', selectedNodes, node.id)
            const selectedNodeIndex = selectedNodes.findIndex(aNode => aNode.id === node.id);
            console.log(selectedNodeIndex)
            console.log('new selected node', selectedNodes[selectedNodeIndex - 1]);
            if (selectedNodeIndex !== -1) {
                setSelectedNode(selectedNodes[selectedNodeIndex - 1]);
                // need to replace node in node array and set is selected to true
            } else {
                setSelectedNode(null);
            }
        }

        setSelectedNodes(selectedNodes.filter(aNode => aNode.id !== node.id));

        updatedNodes
            .filter(aNode => !aNode.isRoot && aNode.parents.length === 0)
            .forEach(aNode => removeNode(aNode, updatedNodes))
    };

    const cancelAddNode = () => {
        const node = nodes.find(node => node.isNew);

        if (node) {
            const updatedNodes = nodes.filter(aNode => aNode.id !== node.id);

            if (updatedNodes.length === 0) {
                if (selectedNodes.length) {
                    setSelectedNodes(selectedNodes.slice(0, selectedNodes.length - 1));
                    setSelectedNode(selectedNodes[selectedNodes.length - 2]);
                } else {
                    setSelectedNode(null);
                }
            }

            setNodes(updatedNodes);
        }
    };

    const onKeyDown = e => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            removeNode(nodes.find(node => node.isSelected), nodes);
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
