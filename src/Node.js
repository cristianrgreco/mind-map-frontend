import React, {useState, useRef} from 'react';
import AutosizeInput from 'react-input-autosize';
import styles from './Node.module.css';

export function Node({value, setValue, x, y, setPosition, isNew, setIsNew, isSelected, setIsSelected, isRoot}) {
    const ref = useRef(null);

    const [dragOffset, setDragOffset] = useState({x: 0, y: 0});

    const style = {left: `${x}px`, top: `${y}px`};

    const onKeyDown = e => {
        if (e.key !== 'Escape') {
            e.stopPropagation();
        }
        if (e.key === 'Enter') {
            setIsNew(false);
        }
    };

    const onValueChange = e => {
        setValue(e.target.value)
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
        e.dataTransfer.effectAllowed = 'all';
        setDragOffset({x: x - e.pageX, y: y - e.pageY});
    };

    const onDragEnd = e => {
        e.stopPropagation();
        setPosition(e.pageX + dragOffset.x, e.pageY + dragOffset.y);
    };

    return (
        <div ref={ref}
             className={`${styles.Node} ${isSelected && styles.Selected} ${isNew && styles.New} ${isRoot && styles.Root}`}
             style={style}
             onClick={onClick}
             onDoubleClick={onDoubleClick}
             draggable={true} onDragStart={onDragStart} onDrag={onDragEnd} onDragEnd={onDragEnd}>

            {!isNew
                ? <span>{value}</span>
                : <AutosizeInput
                    className={styles.Input}
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
