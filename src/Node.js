import React from 'react';
import AutosizeInput from 'react-input-autosize';
import styles from './Node.module.css';

// todo add visual indication when node is new, like a star on the top right
export function Node({value, setValue, x, y, setPosition, isNew, setIsNew, isSelected, setIsSelected, isRoot}) {
    const style = {left: `${x}px`, top: `${y}px`};

    const onKeyDown = e => {
        if (e.key !== 'Escape') {
            e.stopPropagation();
        }
        if (e.key === 'Enter') {
            setIsNew(false);
        }
    };

    const onClick = e => {
        e.stopPropagation();
        setIsSelected(true);
    };

    const onDoubleClick = e => {
        e.stopPropagation();
        setIsNew(true);
    };

    // todo seems to be off
    // todo animation ends and then it happens
    const onDragEnd = e => {
        e.stopPropagation();
        setPosition(e.pageX, e.pageY);
    };

    return (
        <div className={`${styles.Node} ${isSelected && styles.Selected}`}
             style={style}
             onClick={onClick}
             onDoubleClick={onDoubleClick}
             draggable={true} onDragEnd={onDragEnd}>

            {!isNew
                ? <span>{value}</span>
                : <AutosizeInput
                    className={styles.Input}
                    name={value}
                    value={value}
                    autoFocus={true}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                />
            }
        </div>
    );
}
