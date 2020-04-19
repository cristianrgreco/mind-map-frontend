import React, {Fragment, useState} from "react";
import styles from './Map.module.css';
import {Node} from "./Node";
import {Line} from "./Line";
import {NodeList} from "./NodeList";

/* todo
 *  - hotkeys and instructions (map in bottom right?)
 *  - when you load, we create a UUID, and changes are insta-saved
 */
export function Map() {
    const [nodeList, setNodeList] = useState(new NodeList());
    const [scale, setScale] = useState({value: 1.2, min: 0.7, max: 1.7, step: 0.1});

    const addNode = e =>
        setNodeList(nodeList.addNode(e.pageX, e.pageY));

    const setValue = node => (value, width, height) =>
        setNodeList(nodeList.setValue(node.id, value, width, height));

    const setPosition = node => (x, y) =>
        setNodeList(nodeList.setPosition(node.id, x, y));

    const setIsNew = node => isNew =>
        setNodeList(nodeList.setIsNew(node.id, isNew));

    const setIsSelected = node => () =>
        setNodeList(nodeList.setIsSelected(node.id));

    const setScaleValue = value => {
        setScale({...scale, value});
    };

    const onKeyDown = e => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            setNodeList(nodeList.removeNode(nodeList.findSelectedNode()));
        } else if (e.key === 'Escape') {
            setNodeList(nodeList.cancelAddNode());
        } else if (e.key === '-') {
            setScale({...scale, value: Math.max(scale.min, scale.value - scale.step)});
        } else if (e.key === '+') {
            setScale({...scale, value: Math.min(scale.max, scale.value + scale.step)});
        }
    };

    return (
        <Fragment>
            <input
                className={styles.Slider}
                type="range"
                min="0.7" max="1.7" step="0.1"
                value={scale.value}
                onChange={e => setScaleValue(e.target.value)}
            />
            <div
                style={{zoom: `${scale.value * 100}%`}}
                tabIndex={0}
                className={styles.Map}
                onClick={addNode}
                onKeyDown={onKeyDown}
                onDragOver={e => e.preventDefault()}>

                {nodeList.nodes.length === 0
                    ? <div className={styles.Start}>Click anywhere to start</div>
                    : nodeList.nodes.map(node => {
                        const parent = nodeList.findById(node.parent);
                        return (
                            <Fragment key={node.id}>
                                <Node
                                    value={node.value}
                                    setValue={setValue(node)}
                                    scale={scale.value}
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
                                        from={{
                                            x: node.x * (1 / scale.value),
                                            y: node.y * (1 / scale.value),
                                            w: node.width,
                                            h: node.height
                                        }}
                                        to={{
                                            x: parent.x * (1 / scale.value),
                                            y: parent.y * (1 / scale.value),
                                            w: parent.width,
                                            h: parent.height
                                        }}/>
                                )}
                            </Fragment>
                        );
                    })
                }
            </div>
        </Fragment>
    );
}
