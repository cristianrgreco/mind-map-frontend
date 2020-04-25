import React, {Fragment, useEffect, useLayoutEffect, useRef, useState} from "react";
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
 *  - allow clicking on preview to go there
 *  - put the preview in a container which we can put border/style properly
 *  - double clicking node doesn't select it
 *  - improve positioning/layering of elements on the canvas
 */

const size = 3000;

export function Map() {
    const previewRef = useRef(null);
    const {id} = useParams();
    const [nodeList, setNodeList] = useState(new NodeList());
    const [startDrag, setStartDrag] = useState({type: null, id: null, x: 0, y: 0});
    const [pan, setPan] = useState({
        x: -(size / 2) + (window.innerWidth / 2),
        y: -(size / 2) + (window.innerHeight / 2)
    });
    const [initialised, setIsInitialised] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useLayoutEffect(() => {
        function updatePan() {
            setPanBounded({
                x: -(size / 2) + (window.innerWidth / 2),
                y: -(size / 2) + (window.innerHeight / 2)
            });
        }

        window.addEventListener('resize', updatePan);
        updatePan();
        return () => window.removeEventListener('resize', updatePan);
    }, []);

    const setPanBounded = newPan => {
        setPan({
            x: Math.max(-size + window.innerWidth, Math.min(0, newPan.x)),
            y: Math.max(-size + window.innerHeight, Math.min(0, newPan.y))
        });
    };

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
            setPanBounded({x: pan.x, y: pan.y});
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

    const onClickPreview = e => {
        const previewRect = previewRef.current.getBoundingClientRect();

        const x = (e.clientX - previewRect.left);
        const y = (e.clientY - previewRect.top)

        const scaledX = x * (1 / 0.075);
        const scaledY = y * (1 / 0.075);

        const translatedX = scaledX - (window.innerWidth / 2);
        const translatedY = scaledY - (window.innerHeight / 2);

        setPanBounded({
            x: -translatedX,
            y: -translatedY
        })

        e.stopPropagation();
    }

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
            setPanBounded({x: e.pageX + startDrag.x, y: e.pageY + startDrag.y});
        }
    };

    const viewport = {
        x: Math.abs(pan.x),
        y: Math.abs(pan.y),
        w: window.innerWidth,
        h: window.innerHeight
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
            {!isEmpty && (
                <div className={styles.MapPreviewContainer}>
                    <div className={styles.MapPreview} onClick={onClickPreview} ref={previewRef}>
                        {nodeList.nodes.map(node => {
                            const parent = nodeList.getNode(node.parent);
                            return (
                                <Fragment key={node.id}>
                                    <Node
                                        value={node.value}
                                        setValue={() => {
                                        }}
                                        x={node.x}
                                        y={node.y}
                                        setStartDrag={() => {
                                        }}
                                        isNew={node.isNew}
                                        setIsNew={() => {
                                        }}
                                        isSelected={node.isSelected}
                                        setIsSelected={() => {
                                        }}
                                        isPreview={true}
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
                        <svg className={styles.Viewport}>
                            <polyline
                                points={`${viewport.x},${viewport.y} ${viewport.x},${viewport.y + viewport.h} ${viewport.x + viewport.w},${viewport.y + viewport.h} ${viewport.x + viewport.w},${viewport.y} ${viewport.x},${viewport.y}`}
                                style={{fill: 'none', stroke: '#ccc', strokeWidth: '15'}}
                            />
                        </svg>
                    </div>
                </div>
            )}
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
            {!isEmpty && (
                <Legend/>
            )}
        </div>
    );
}
