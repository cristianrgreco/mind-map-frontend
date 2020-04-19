import React, {useEffect, useRef, useState} from 'react';
import AutosizeInput from 'react-input-autosize';
import styles from './Node.module.css';
import dragImage from "./dragImage";

export function Node({value, setValue, x, y, setPosition, isNew, setIsNew, isSelected, setIsSelected, isRoot}) {
    const ref = useRef(null);

    useEffect(() => {
        setValue(value, ref.current.offsetWidth, ref.current.offsetHeight);
    }, []);

    const [dragOffset, setDragOffset] = useState({x: 0, y: 0});

    const onKeyDown = e => {
        if (e.key !== 'Escape') {
            e.stopPropagation();
        }
        if (e.key === 'Enter' && value.length) {
            setIsNew(false);
        }
    };

    const onValueChange = e => {
        setValue(e.target.value, ref.current.offsetWidth, ref.current.offsetHeight);
    };

    const onClick = e => {
        e.stopPropagation();

        if (!isNew) {
            setIsSelected();
        }
    };

    const onDoubleClick = e => {
        e.stopPropagation();
        setIsNew(true);
    };

    const onDragStart = e => {
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setDragOffset({x: x - e.pageX, y: y - e.pageY});
    };

    // todo quick drag makes it go to 0,0
    const onDrag = e => {
        e.stopPropagation();

        if (e.pageX) {
            setPosition(e.pageX + dragOffset.x, e.pageY + dragOffset.y);
        }
    };

    return (
        <div
            ref={ref}
            className={`${styles.Node} ${isSelected && styles.Selected} ${isNew && styles.New} ${isRoot && styles.Root}`}
            style={{left: `${x}px`, top: `${y}px`}}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            draggable={true} onDragStart={onDragStart} onDrag={onDrag}>

            {!isNew
                ? <span>{value}</span>
                : <AutosizeInput
                    name={value}
                    value={value}
                    autoFocus={true}
                    onChange={onValueChange}
                    onKeyDown={onKeyDown}
                />
            }
        </div>
    );
}
