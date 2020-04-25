import React, {useEffect, useRef} from 'react';
import AutosizeInput from 'react-input-autosize';
import styles from './Node.module.css';
import dragImage from "./dragImage";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function Node({value, setValue, x, y, backgroundColor, setStartDrag, isNew, setIsNew, isSelected, setIsSelected, isRoot, isPreview}) {
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

    const style = {
        backgroundColor,
        transform: `translate3d(${x}px, ${y}px, 0)`
    };

    return (
        <div
            ref={ref}
            className={`${styles.Node} ${isSelected && styles.Selected} ${isPreview && styles.Preview} ${isRoot && styles.Root}`}
            style={style}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            draggable={true}
            onDragStart={onDragStart}
        >
            <div className={styles.Edit}>
                {isNew && <FontAwesomeIcon icon={faPencilAlt}/>}
            </div>
            {!isNew || isPreview
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
