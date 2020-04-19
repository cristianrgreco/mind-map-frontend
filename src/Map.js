import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";
import {NodeList} from "./NodeList";
import dragImage from "./dragImage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPointer, faBackspace, faArrowsAlt} from '@fortawesome/free-solid-svg-icons'

/* todo
 *  - hotkeys and instructions (map in bottom right?)
 *  - when you load, we create a UUID, and changes are insta-saved
 *  - cancel node edit when click away if there's text, cancel node otherwise
 *  - double clicking node doesn't select it
 */
export function Map() {
    const [nodeList, setNodeList] = useState(new NodeList());
    const [startPan, setStartPan] = useState({x: 0, y: 0});
    const [pan, setPan] = useState({x: -5000, y: -5000});

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
        <div onDragOver={e => e.preventDefault()}>
            <div
                style={{transform: `translateX(${pan.x}px) translateY(${pan.y}px)`}}
                className={styles.Map}
                onClick={addNode}
                onKeyDown={onKeyDown}
                tabIndex={0}
                draggable={true}
                onDragStart={onDragStart}
                onDrag={onDrag}>

                {nodeList.nodes.length === 0
                    ? <div className={styles.Start}>Click anywhere to start</div>
                    : nodeList.nodes.map(node => {
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
                    })
                }
            </div>
            <div className={styles.Legend}>
                <div className={styles.LegendItem}>Pan with <FontAwesomeIcon icon={faArrowsAlt}/></div>
                <div className={styles.LegendItem}>Select node with <FontAwesomeIcon icon={faHandPointer}/></div>
                <div className={styles.LegendItem}>Move node by <FontAwesomeIcon icon={faArrowsAlt}/> on a node</div>
                <div className={styles.LegendItem}>Delete node with <FontAwesomeIcon icon={faBackspace}/> on a selected node</div>
                <div className={styles.LegendItem}>Cancel add node with ESC</div>
            </div>
        </div>
    );
}
