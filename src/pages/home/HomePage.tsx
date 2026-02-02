import React from "react";
import { TaskListVirtualized } from "@widgets/task-list";
import { CreateTaskButton } from "@features/task-create";
import styles from "./HomePage.module.scss";

export const HomePage: React.FC = () => {
  return (
    <div className={styles.page} translate="no">
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title} translate="no">Список задач</h1>
          <p className={styles.subtitle} translate="no">
            Бесконечный скролл с виртуализацией. Всего задач: 200 +
          </p>
        </div>
        <CreateTaskButton />
      </header>

      <main className={styles.main}>
        <div className={styles.listContainer}>
          <TaskListVirtualized />
        </div>

        <div className={styles.infoPanel} translate="no">
          <h3 translate="no">Как пользоваться</h3>
          <ul>
            <li><strong translate="no">Просмотр:</strong> Нажмите "Просмотр" на карточке задачи</li>
            <li><strong translate="no">Скролл:</strong> Листайте вниз для подгрузки новых задач</li>
            <li><strong translate="no">Статус:</strong> ✓ Выполнена / ○ В работе</li>
            <li><strong translate="no">Детали:</strong> На странице задачи можно изменить статус или удалить</li>
          </ul>
        </div>
      </main>
    </div>
  );
};
