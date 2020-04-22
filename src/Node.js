import React, {useEffect, useRef} from 'react';
import AutosizeInput from 'react-input-autosize';
import styles from './Node.module.css';
import dragImage from "./dragImage";

export function Node({value, setValue, x, y, setStartDrag, isNew, setIsNew, isSelected, setIsSelected, isRoot}) {
    const ref = useRef(null);

    useEffect(() => {
        setValue(value, ref.current.offsetWidth, ref.current.offsetHeight);
    }, []);

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
        e.stopPropagation();

        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setStartDrag(x - e.pageX, y - e.pageY);
    };

    return (
        <div
            ref={ref}
            className={`${styles.Node} ${isSelected && styles.Selected} ${isNew && styles.New} ${isRoot && styles.Root}`}
            style={{transform: `translate3d(${x}px, ${y}px, 0)`}}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            draggable={true}
            onDragStart={onDragStart}
        >
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
