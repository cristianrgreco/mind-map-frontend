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
 *  - replace CSS modules with inline, and possibly SASS
 *  - cancel node edit when click away if there's text, cancel node otherwise
 *  - double clicking node doesn't select it
 */
export function Map() {
    const {id} = useParams();
    const [nodeList, setNodeList] = useState(new NodeList());
    const [startPan, setStartPan] = useState({x: 0, y: 0});
    const [pan, setPan] = useState({x: -5000, y: -5000});
    const [initialised, setIsInitialised] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (initialised) {
            const handler = setTimeout(() => saveData(), 500);
            return () => clearTimeout(handler);
        }
    }, [nodeList, pan]);

    const isEmpty = initialised && nodeList.nodes.length === 0;

    const fetchData = async () => {
        const result = await fetchMindMap(id);

        if (result.status === 200) {
            const {nodeList, pan} = result.data;
            setNodeList(new NodeList(undefined, nodeList.nodes, nodeList.selectedNodes, nodeList.lastAddedNode));
            setPan({x: pan.x, y: pan.y}); // todo pan seems to be off a little sometimes
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

    const addNode = e =>
        setNodeList(nodeList.addNode(e.pageX - pan.x, e.pageY - pan.y));

    const setValue = node => (value, width, height) =>
        setNodeList(nodeList.setValue(node.id, value, width, height));

    const setPosition = node => (x, y) =>
        setNodeList(nodeList.setPosition(node.id, x, y));

    const setIsNew = node => isNew =>
        setNodeList(nodeList.setIsNew(node.id, isNew).setIsSelected(node.id));

    const setIsSelected = node => () =>
        setNodeList(nodeList.setIsSelected(node.id));

    const onKeyDown = e => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            setNodeList(nodeList.removeNode(nodeList.getSelectedNode()));
        } else if (e.key === 'Escape') {
            setNodeList(nodeList.cancelAddNode());
        }
    };

    const onDragStart = e => {
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setStartPan({x: pan.x - e.pageX, y: pan.y - e.pageY});
    };

    const onDrag = e => {
        e.preventDefault();

        if (e.pageX && e.pageY) {
            setPan({x: e.pageX + startPan.x, y: e.pageY + startPan.y});
        }
    };

    return (
        <div onClick={addNode} onKeyDown={onKeyDown} onDragOver={e => e.preventDefault()}>
            <div
                style={{transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`}}
                tabIndex={0}
                className={`${styles.Map} ${isEmpty && styles.Empty}`}
                draggable={true}
                onDragStart={onDragStart}
                onDrag={onDrag}>

                {nodeList.nodes.map(node => {
                    const parent = nodeList.getNode(node.parent);
                    return (
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
