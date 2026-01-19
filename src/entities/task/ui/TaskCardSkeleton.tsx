import React from "react";
import styles from "./TaskCardSkeleton.module.scss";

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.numberSkeleton}></div>
          <div className={styles.statusSkeleton}></div>
        </div>

        <div className={styles.info}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.descriptionSkeleton}></div>
          <div className={styles.descriptionSkeleton}></div>
        </div>

        <div className={styles.footer}>
          <div className={styles.indexSkeleton}></div>
          <div className={styles.buttonSkeleton}></div>
        </div>
      </div>
    </div>
  );
};
