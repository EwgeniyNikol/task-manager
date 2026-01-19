import React from "react";
import { useTasksInfiniteQuery } from "@entities/task";
import { TaskCard, TaskCardSkeleton } from "@entities/task/ui";
import styles from "./TaskListVirtualized.module.scss";

export const SimpleTaskList: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useTasksInfiniteQuery();

  // Получаем все задачи из всех страниц
  const allTasks = data?.pages.flatMap((page) => page.tasks) || [];

  if (isLoading && !data) {
    return (
      <div className={styles.skeletonContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Ошибка при загрузке задач</h3>
        <p>Попробуйте обновить страницу</p>
      </div>
    );
  }

  return (
    <div className={styles.simpleContainer}>
      {allTasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} />
      ))}
      
      {hasNextPage && (
        <div className={styles.loadMore}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreButton}
          >
            {isFetchingNextPage ? "Загрузка..." : "Загрузить еще"}
          </button>
        </div>
      )}
    </div>
  );
};
