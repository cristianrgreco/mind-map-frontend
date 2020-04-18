import React, {useState} from 'react';
import styles from './Node.module.css';

export function Node({value, x, y, isNew, isSelected, setIsSelected, setPosition}) {
    const [_value, setValue] = useState(value);
    const [_isNew, setIsNew] = useState(isNew);

    const style = {left: `${x}px`, top: `${y}px`};

    const onKeyDown = e => {
        if (e.key === 'Enter') {
            setIsNew(false);
        }
    };

    const onClick = e => {
        e.stopPropagation();
        setIsSelected();
    };

    const onDrag = e => {
        console.log(e);
        // e.preventDefault();
        // e.stopPropagation();
        setPosition(e.pageX, e.pageY);
    };

    return (
        <div className={`${styles.Node} ${isSelected && styles.Selected}`}
             style={style}
             // onClick={onClick}
             draggable={true} onDragEnd={onDrag}>

            {!_isNew
                ? <span>{_value}</span>
                : <input type="text"
                         name={_value}
                         autoFocus={true}
                         onChange={e => setValue(e.target.value)}
                         onKeyDown={onKeyDown}
                />
            }
        </div>
    );
}
