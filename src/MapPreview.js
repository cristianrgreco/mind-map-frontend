import React, {Fragment, useRef} from "react";
import styles from "./MapPreview.module.css";
import {Node} from "./Node";
import {Line} from "./Line";
import {noop} from "./events";

export function MapPreview({nodeList, pan, setPan}) {
    const ref = useRef(null);

    const viewport = {
        x: Math.abs(pan.x),
        y: Math.abs(pan.y),
        w: window.innerWidth,
        h: window.innerHeight
    };

    const onClick = e => {
        const rect = ref.current.getBoundingClientRect();

        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top)

        const scaledX = x * (1 / 0.075);
        const scaledY = y * (1 / 0.075);

        const translatedX = scaledX - (window.innerWidth / 2);
        const translatedY = scaledY - (window.innerHeight / 2);

        setPan({
            x: -translatedX,
            y: -translatedY
        })

        e.stopPropagation();
    }

    return (
        <div className={styles.MapPreviewContainer}>
            <div className={styles.MapPreview} onClick={onClick} ref={ref}>
                {nodeList.nodes.map(node => {
                    const parent = nodeList.getNode(node.parent);
                    return (
                        <Fragment key={node.id}>
                            <Node
                                value={node.value}
                                setValue={noop}
                                x={node.x}
                                y={node.y}
                                setStartDrag={noop}
                                isNew={node.isNew}
                                setIsNew={noop}
                                isSelected={node.isSelected}
                                setIsSelected={noop}
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
    );
}
