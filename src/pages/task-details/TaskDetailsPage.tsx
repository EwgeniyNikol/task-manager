import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskQuery, useDeleteTask, useUpdateTask } from "@entities/task";
import { TaskEditForm } from "@features/task-edit";
import styles from "./TaskDetailsPage.module.scss";

export const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = parseInt(id || "0");
  
  const { data: task, isLoading, error } = useTaskQuery(taskId);
  const deleteMutation = useDeleteTask();
  const updateMutation = useUpdateTask();

  const handleToggleComplete = () => {
    if (task) {
      updateMutation.mutate({
        id: task.id,
        completed: !task.completed,
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить эту задачу?")) {
      deleteMutation.mutate(taskId, {
        onSuccess: () => navigate("/"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка задачи...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className={styles.error}>
        <h2>Задача не найдена</h2>
        <p>Задача с ID #{taskId} не существует или была удалена</p>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          ← Вернуться к списку
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.page}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Назад
      </button>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{task.title}</h1>
            <div className={styles.meta}>
              <span className={task.completed ? styles.statusCompleted : styles.statusPending}>
                {task.completed ? "✓ Выполнена" : "○ В работе"}
              </span>
              <span className={styles.id}>ID: #{task.id}</span>
              <span className={styles.date}>
                Создана: {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button
              onClick={handleToggleComplete}
              className={task.completed ? styles.markPendingButton : styles.markCompleteButton}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Обновление..." : 
               task.completed ? "Отметить как невыполненную" : "Отметить как выполненную"}
            </button>
            
            <TaskEditForm task={task} />
            
            <button
              onClick={handleDelete}
              className={styles.deleteButton}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Удаление..." : "Удалить задачу"}
            </button>
          </div>
        </div>
        
        <div className={styles.details}>
          <div className={styles.card}>
            <h3>Описание</h3>
            <p className={styles.description}>{task.description}</p>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h4>Информация о задаче</h4>
              <ul>
                <li>
                  <strong>ID:</strong> {task.id}
                </li>
                <li>
                  <strong>Статус:</strong>{" "}
                  <span className={task.completed ? styles.completedText : styles.pendingText}>
                    {task.completed ? "Выполнена" : "В работе"}
                  </span>
                </li>
                <li>
                  <strong>Пользователь:</strong> #{task.userId}
                </li>
                <li>
                  <strong>Создана:</strong> {formatDate(task.createdAt)}
                </li>
              </ul>
            </div>
            
            <div className={styles.infoCard}>
              <h4>Действия</h4>
              <div className={styles.actionButtons}>
                <button
                  onClick={handleToggleComplete}
                  className={task.completed ? styles.secondaryButton : styles.primaryButton}
                >
                  {task.completed ? "Вернуть в работу" : "Завершить"}
                </button>
                <button
                  onClick={() => navigate("/")}
                  className={styles.secondaryButton}
                >
                  К списку задач
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
