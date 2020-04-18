import React from 'react';
import styles from './Node.module.css';

export function Node({value, setValue, x, y, setPosition, isNew, setIsNew, isSelected, setIsSelected}) {
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

    const onDragEnd = e => {
        e.stopPropagation();
        setPosition(e.pageX, e.pageY);
    };

    return (
        <div className={`${styles.Node} ${isSelected && styles.Selected}`}
             style={style}
             onClick={onClick}
             draggable={true} onDragEnd={onDragEnd}>

            {!isNew
                ? <span>{value}</span>
                : <input type="text"
                         name={value}
                         autoFocus={true}
                         onChange={e => setValue(e.target.value)}
                         onKeyDown={onKeyDown}
                />
            }
        </div>
    );
}
