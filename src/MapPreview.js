import React, { Fragment, useRef } from "react";
import styles from "./MapPreview.module.css";
import { Node } from "./Node";
import { Line } from "./Line";
import { noop } from "./events";
import { Square } from "./Square";

export function MapPreview({ nodeList, pan, setPan, size }) {
  const scale = 200 / size;

  const ref = useRef(null);

  const viewport = {
    x: Math.abs(pan.x),
    y: Math.abs(pan.y),
    w: window.innerWidth,
    h: window.innerHeight,
  };

  const onClick = (e) => {
    const rect = ref.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaledX = x * (1 / scale);
    const scaledY = y * (1 / scale);

    const translatedX = scaledX - window.innerWidth / 2;
    const translatedY = scaledY - window.innerHeight / 2;

    setPan({
      x: -translatedX,
      y: -translatedY,
    });

    e.stopPropagation();
  };

  const containerStyle = {
    width: `${size * scale}px`,
    height: `${size * scale}px`,
  };

  const mapStyle = {
    width: `${size}px`,
    height: `${size}px`,
    top: `${-(size / 2)}px`,
    right: `${-(size / 2)}px`,
    transform: `scale(${scale}, ${scale}) translate(-50%, 50%)`,
  };

  return (
    <div className={styles.MapPreviewContainer} style={containerStyle}>
      <div className={styles.MapPreview} style={mapStyle} onClick={onClick} ref={ref}>
        <div className={styles.Container}>
          {nodeList.nodes.map((node) => {
            const parent = nodeList.getNode(node.parent);
            return (
              <Fragment key={node.id}>
                <Node
                  value={node.value}
                  setValue={noop}
                  x={node.x}
                  y={node.y}
                  backgroundColor={nodeList.getColour(node)}
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
                    from={{ x: node.x, y: node.y, w: node.width, h: node.height }}
                    to={{ x: parent.x, y: parent.y, w: parent.width, h: parent.height }}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
        <Square rect={viewport} />
      </div>
    </div>
  );
}
