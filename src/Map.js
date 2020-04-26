import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Map.module.css";
import { Node } from "./Node";
import { Line } from "./Line";
import { NodeList } from "./NodeList";
import dragImage from "./dragImage";
import { Legend } from "./Legend";
import { fetchMindMap, saveMindMap } from "./api";
import { MapPreview } from "./MapPreview";
import { MapInfo } from "./MapInfo";
import { MapControls } from "./MapControls";

/* todo
 *  - add behaviour tests (on click, etc) for Map
 *  - perf enhancement in calculating node colours when updated?
 *  - double clicking node doesn't select it
 *  - improve positioning/layering of elements on the canvas
 */
export function Map() {
  const size = Math.max(window.innerWidth, window.innerHeight) * 2;
  const { id } = useParams();
  const [nodeList, setNodeList] = useState(new NodeList());
  const [startDrag, setStartDrag] = useState({ type: null, id: null, x: 0, y: 0 });
  const [pan, setPan] = useState({
    x: -(size / 2) + window.innerWidth / 2,
    y: -(size / 2) + window.innerHeight / 2,
  });
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

  useLayoutEffect(() => {
    const updateSize = () => setPanBounded((pan) => ({ ...pan }));
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [window.innerWidth, window.innerHeight]);

  const isEmpty = initialised && nodeList.nodes.length === 0;

  const setPanBounded = (pan) => {
    if (typeof pan === "function") {
      setPan((currentPan) => {
        const newPan = pan(currentPan);
        return {
          x: Math.max(-size + window.innerWidth, Math.min(0, newPan.x)),
          y: Math.max(-size + window.innerHeight, Math.min(0, newPan.y)),
        };
      });
    } else {
      setPan({
        x: Math.max(-size + window.innerWidth, Math.min(0, pan.x)),
        y: Math.max(-size + window.innerHeight, Math.min(0, pan.y)),
      });
    }
  };

  const fetchData = async () => {
    const result = await fetchMindMap(id);

    if (result.status === 200) {
      const { nodeList, pan } = result.data;
      setNodeList(new NodeList(undefined, nodeList.nodes, nodeList.selectedNodes));
      setPanBounded({ x: pan.x, y: pan.y });
    }

    setIsInitialised(true);
  };

  const saveData = async () => {
    setIsSaving(true);

    const data = {
      nodeList: {
        nodes: nodeList.nodes,
        selectedNodes: nodeList.selectedNodes,
      },
      pan: {
        x: pan.x,
        y: pan.y,
      },
    };

    await saveMindMap(id, data);
    setIsSaving(false);
  };

  const onClick = (e) => {
    const newNode = nodeList.getNewNode();

    if (newNode) {
      if (newNode && newNode.value.length > 0) {
        setNodeList(nodeList.setIsNew(newNode.id, false).setIsSelected(newNode.id));
      } else {
        setNodeList(nodeList.removeEmptyNodes());
      }
    } else {
      setNodeList(nodeList.addNode(e.pageX - pan.x, e.pageY - pan.y));
    }
  };

  const setValue = (node) => (value, width, height) => setNodeList(nodeList.setValue(node.id, value, width, height));

  const setPosition = (nodeId, x, y) => setNodeList(nodeList.setPosition(nodeId, x, y));

  const setIsNew = (node) => (isNew) => setNodeList(nodeList.setIsNew(node.id, isNew).setIsSelected(node.id));

  const setIsSelected = (node) => () => setNodeList(nodeList.setIsSelected(node.id).removeEmptyNodes());

  const setMapDragStart = (x, y) => setStartDrag({ type: "map", x, y });

  const setNodeDragStart = (node) => (x, y) => setStartDrag({ type: "node", id: node.id, x, y });

  const onKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      setNodeList(nodeList.removeNode(nodeList.getSelectedNode()));
    } else if (e.key === "Escape") {
      setNodeList(nodeList.removeEmptyNodes());
    }
  };

  const onDragStart = (e) => {
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setMapDragStart(pan.x - e.pageX, pan.y - e.pageY);
  };

  const onDragOver = (e) => {
    e.preventDefault();

    if (startDrag.type === "node") {
      setPosition(startDrag.id, e.pageX + startDrag.x, e.pageY + startDrag.y);
    } else if (startDrag.type === "map") {
      setPanBounded({ x: e.pageX + startDrag.x, y: e.pageY + startDrag.y });
    }
  };

  const mapStyle = {
    width: `${size}px`,
    height: `${size}px`,
    transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
  };

  return (
    <div onClick={onClick} onKeyDown={onKeyDown} onDragOver={onDragOver}>
      <div
        tabIndex={0}
        style={mapStyle}
        className={`${styles.Map} ${isEmpty && styles.Empty}`}
        draggable={true}
        onDragStart={onDragStart}
      >
        {nodeList.nodes.map((node) => {
          const parent = nodeList.getNode(node.parent);
          return (
            <Fragment key={node.id}>
              <Node
                value={node.value}
                setValue={setValue(node)}
                x={node.x}
                y={node.y}
                backgroundColor={nodeList.getColour(node)}
                setStartDrag={setNodeDragStart(node)}
                isNew={node.isNew}
                setIsNew={setIsNew(node)}
                isSelected={node.isSelected}
                setIsSelected={setIsSelected(node)}
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
      <MapInfo initialised={initialised} isSaving={isSaving} />
      {isEmpty && <div className={styles.Start}>Click anywhere to start</div>}
      {initialised && !isEmpty && <MapControls isEmpty={isEmpty} />}
      {initialised && !isEmpty && <MapPreview nodeList={nodeList} pan={pan} setPan={setPanBounded} size={size} />}
      {initialised && !isEmpty && <Legend />}
    </div>
  );
}
