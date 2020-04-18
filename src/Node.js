import React, {useState} from 'react';
import styles from './Node.module.css';

export function Node({value, x, y, isNew, isSelected, setIsSelected = () => {}, connections = []}) {
    const [_value, setValue] = useState(value);
    const [_isNew, setIsNew] = useState(isNew);
    const [_connections, setConnections] = useState(connections);

    const style = {left: `${x}px`, top: `${y}px`};

    const onKeyDown = e => {
        if (e.key === 'Enter') {
            setIsNew(false);
        }
    };

    return (
        <div className={`${styles.Node} ${isSelected && styles.Selected}`} style={style} onClick={setIsSelected}>
            {!_isNew
                ? <span>{_value}</span>
                : <input
                    type="text"
                    name={_value}
                    autoFocus={true}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                />
            }
        </div>
    );
}
