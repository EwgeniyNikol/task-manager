import React, { useCallback } from "react";
import { AutoSizer, List, ListRowRenderer } from "react-virtualized";
import { useTasksInfiniteQuery } from "@entities/task";
import { TaskCard, TaskCardSkeleton } from "@entities/task/ui";
import styles from "./TaskListVirtualized.module.scss";

export const TaskListVirtualized: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useTasksInfiniteQuery();

  const allTasks = data?.pages.flatMap((page) => page.tasks) || [];
  const rowCount = allTasks.length + (hasNextPage ? 1 : 0);

  const loadMoreRows = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, key, style }) => {
      if (index >= allTasks.length) {
        return (
          <div key={key} style={style} className={styles.loadingRow}>
            <div className={styles.loadingText}>
              {isFetchingNextPage ? "Загрузка..." : "Загрузить еще"}
            </div>
          </div>
        );
      }

      const task = allTasks[index];
      return <TaskCard key={key} task={task} index={index} style={style} />;
    },
    [allTasks, isFetchingNextPage]
  );

  const onRowsRendered = useCallback(
    ({ stopIndex }: { stopIndex: number }) => {
      if (stopIndex >= allTasks.length - 5 && hasNextPage && !isFetchingNextPage) {
        loadMoreRows();
      }
    },
    [allTasks.length, hasNextPage, isFetchingNextPage, loadMoreRows]
  );

  if (isLoading && !data) {
    return (
      <div className={styles.skeletonContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
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
    <div className={styles.container}>
      <div style={{ height: "calc(100vh - 300px)", minHeight: "600px", width: "100%" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={rowCount}
              rowHeight={230} // Увеличили высоту для новых данных
              rowRenderer={rowRenderer}
              onRowsRendered={onRowsRendered}
              overscanRowCount={5}
              className={styles.virtualizedList}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
