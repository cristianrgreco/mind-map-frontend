import React from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./MapInfo.module.css";

export function MapInfo({ initialised, isSaving }) {
  return (
    <div className={styles.Info}>
      {!initialised && (
        <div>
          <span className={styles.InfoItem}>Loading</span>
          <span className={styles.ItemIcon}>
            <FontAwesomeIcon icon={faSync} spin={true} />
          </span>
        </div>
      )}
      {isSaving && (
        <div>
          <span className={styles.InfoItem}>Saving</span>
          <span className={styles.ItemIcon}>
            <FontAwesomeIcon icon={faSync} spin={true} />
          </span>
        </div>
      )}
    </div>
  );
}
