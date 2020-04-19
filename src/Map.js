import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";
import {NodeList} from "./NodeList";

/* todo
 *   - hotkeys and instructions (map in bottom right?)
 */
export function Map() {
    const [nodeList, setNodeList] = useState(new NodeList());

    const addNode = e =>
        setNodeList(nodeList.addNode(e.pageX, e.pageY));

    const setValue = node => value =>
        setNodeList(nodeList.setValue(node.id, value));

    const setPosition = node => (x, y) =>
        setNodeList(nodeList.setPosition(node.id, x, y));

    const setIsNew = node => isNew =>
        setNodeList(nodeList.setIsNew(node.id, isNew));

    const setIsSelected = node => () =>
        setNodeList(nodeList.setIsSelected(node.id));

    const findParent = id =>
        nodeList.nodes.find(node => node.id === id);

    const onKeyDown = e => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            setNodeList(nodeList.removeNode(nodeList.findSelectedNode()));
        } else if (e.key === 'Escape') {
            setNodeList(nodeList.cancelAddNode());
        }
    };

    return (
        <div className={styles.Map} onClick={addNode} onKeyDown={onKeyDown} tabIndex={0}>
            {nodeList.nodes.length === 0
                ? <div className={styles.Start}>Click anywhere to start</div>
                : nodeList.nodes.map(node => (
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
                ))
            }
        </div>
    );
}
