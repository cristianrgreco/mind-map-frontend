import React, {Fragment, useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import {faSync} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";
import {NodeList} from "./NodeList";
import dragImage from "./dragImage";
import {Legend} from "./Legend";
import {fetchMindMap, saveMindMap} from "./api";

/* todo
 *  - double clicking node doesn't select it
 */
export function Map() {
    const {id} = useParams();
    const [nodeList, setNodeList] = useState(new NodeList());
    const [startDrag, setStartDrag] = useState({type: null, id: null, x: 0, y: 0});
    const [pan, setPan] = useState({x: -5000, y: -5000});
    const [initialised, setIsInitialised] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (initialised) {
            const handler = setTimeout(() => saveData(), 1000);
            return () => clearTimeout(handler);
        }
    }, [nodeList, pan]);

    const isEmpty = initialised && nodeList.nodes.length === 0;

    const fetchData = async () => {
        const result = await fetchMindMap(id);

        if (result.status === 200) {
            const {nodeList, pan} = result.data;
            setNodeList(new NodeList(undefined, nodeList.nodes, nodeList.selectedNodes, nodeList.lastAddedNode));
            setPan({x: pan.x, y: pan.y});
        }

        setIsInitialised(true);
    };

    const saveData = async () => {
        setIsSaving(true);

        const data = {
            nodeList: {
                nodes: nodeList.nodes,
                selectedNodes: nodeList.selectedNodes,
                lastAddedNode: nodeList.lastAddedNode
            },
            pan: {
                x: pan.x,
                y: pan.y
            }
        };

        await saveMindMap(id, data);
        setIsSaving(false);
    };

    const onClick = e => {
        const newNode = nodeList.getNewNode();

        if (newNode) {
            if (newNode && newNode.value.length > 0) {
                setNodeList(nodeList.setIsNew(newNode.id, false).setIsSelected(newNode.id));
            } else {
                setNodeList(nodeList.cancelAddNode());
            }
        } else {
            setNodeList(nodeList.addNode(e.pageX - pan.x, e.pageY - pan.y));
        }
    };

    const setValue = node => (value, width, height) =>
        setNodeList(nodeList.setValue(node.id, value, width, height));

    const setPosition = (nodeId, x, y) =>
        setNodeList(nodeList.setPosition(nodeId, x, y));

    const setIsNew = node => isNew =>
        setNodeList(nodeList.setIsNew(node.id, isNew).setIsSelected(node.id));

    const setIsSelected = node => () =>
        setNodeList(nodeList.setIsSelected(node.id));

    const setMapDragStart = (x, y) =>
        setStartDrag({type: 'map', x, y});

    const setNodeDragStart = node => (x, y) =>
        setStartDrag({type: 'node', id: node.id, x, y})

    const onKeyDown = e => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            setNodeList(nodeList.removeNode(nodeList.getSelectedNode()));
        } else if (e.key === 'Escape') {
            setNodeList(nodeList.cancelAddNode());
        }
    };

    const onDragStart = e => {
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setMapDragStart(pan.x - e.pageX, pan.y - e.pageY);
    };

    const onDragOver = e => {
        e.preventDefault();

        if (startDrag.type === 'node') {
            setPosition(startDrag.id, e.pageX + startDrag.x, e.pageY + startDrag.y);
        } else if (startDrag.type === 'map') {
            setPan({x: e.pageX + startDrag.x, y: e.pageY + startDrag.y});
        }
    };

    return (
        <div onClick={onClick} onKeyDown={onKeyDown} onDragOver={onDragOver}>
            <div
                style={{transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`}}
                tabIndex={0}
                className={`${styles.Map} ${isEmpty && styles.Empty}`}
                draggable={true}
                onDragStart={onDragStart}
            >
                {nodeList.nodes.map(node => {
                    const parent = nodeList.getNode(node.parent);
                    return (
                        <Fragment key={node.id}>
                            <Node
                                value={node.value}
                                setValue={setValue(node)}
                                x={node.x}
                                y={node.y}
                                setStartDrag={setNodeDragStart(node)}
                                isNew={node.isNew}
                                setIsNew={setIsNew(node)}
                                isSelected={node.isSelected}
                                setIsSelected={setIsSelected(node)}
                                isRoot={node.isRoot}
                            />
                            {!node.isRoot && (
                                <Line
                                    from={{x: node.x, y: node.y, w: node.width, h: node.height}}
                                    to={{x: parent.x, y: parent.y, w: parent.width, h: parent.height}}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </div>
            {isEmpty && (
                <div className={styles.Start}>Click anywhere to start</div>
            )}
            <div className={styles.Controls}>
                {initialised && nodeList.nodes.length > 0 && (
                    <div className={styles.ControlItem}>
                        <Link className={styles.Link} to="/">
                            <div className={styles.Button} onClick={e => e.stopPropagation()}>
                                <span>New</span>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
            <div className={styles.Info}>
                {!initialised && (
                    <div>
                        <span className={styles.InfoItem}>Loading</span>
                        <span className={styles.ItemIcon}><FontAwesomeIcon icon={faSync} spin={true}/></span>
                    </div>
                )}
                {isSaving && (
                    <div>
                        <span className={styles.InfoItem}>Saving</span>
                        <span className={styles.ItemIcon}><FontAwesomeIcon icon={faSync} spin={true}/></span>
                    </div>
                )}
            </div>
            <Legend/>
        </div>
    );
}
