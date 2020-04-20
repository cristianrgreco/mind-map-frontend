import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAlt, faBackspace, faHandPointer} from "@fortawesome/free-solid-svg-icons";
import styles from "./Legend.module.css";

export function Legend() {
    return (
        <div className={styles.Legend}>
            <div className={styles.LegendItem}>
                Pan with <FontAwesomeIcon icon={faArrowsAlt}/>
            </div>
            <div className={styles.LegendItem}>
                Create node with <FontAwesomeIcon icon={faHandPointer}/> and <div className={styles.Key}>ENTER</div>
            </div>
            <div className={styles.LegendItem}>
                Select node by <FontAwesomeIcon icon={faHandPointer}/> on a node
            </div>
            <div className={styles.LegendItem}>
                Move node by <FontAwesomeIcon icon={faArrowsAlt}/> a node
            </div>
            <div className={styles.LegendItem}>
                Reword node by <FontAwesomeIcon icon={faHandPointer}/><FontAwesomeIcon icon={faHandPointer}/> on a node
            </div>
            <div className={styles.LegendItem}>
                Delete node by <FontAwesomeIcon icon={faBackspace}/> a selected node
            </div>
            <div className={styles.LegendItem}>
                Cancel adding a node with <div className={styles.Key}>ESC</div>
            </div>
        </div>
    );
}
