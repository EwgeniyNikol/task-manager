import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Task, TaskPriority } from "../model/types";
import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  task: Task;
  index: number;
  style?: React.CSSProperties;
}

// Мемоизируем компонент для предотвращения лишних рендеров
const TaskCardComponent: React.FC<TaskCardProps> = ({ task, style }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const getPriorityInfo = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return { emoji: "🔴", label: "Высокий", color: "#ef4444" };
      case "medium":
        return { emoji: "🟡", label: "Средний", color: "#f59e0b" };
      case "low":
        return { emoji: "🔵", label: "Низкий", color: "#3b82f6" };
      default:
        return { emoji: "🔵", label: "Низкий", color: "#3b82f6" };
    }
  };

  const getRandomUserName = (id: number) => {
    const users = [
      "Анна Сидорова",
      "Иван Петров",
      "Мария Иванова",
      "Алексей Смирнов",
      "Елена Кузнецова",
      "Дмитрий Попов"
    ];
    const fullName = users[id % users.length] || "Пользователь";
    const parts = fullName.split(" ");
    return parts.length > 1 ? `${parts[0][0]}. ${parts[1]}` : fullName;
  };

  const priorityInfo = getPriorityInfo(task.priority || "low");
  const formattedDate = formatDate(task.createdAt);
  const userName = getRandomUserName(Number(task.id));

  return (
    <div className={styles.card} style={style}>
      {/* Верхняя строка: номер, приоритет, статус */}
      <div className={styles.topRow}>
        <div className={styles.taskId}>{task.id} задача</div>
        <div 
          className={styles.priorityBadge} 
          style={{ 
            backgroundColor: `${priorityInfo.color}20`, 
            borderColor: priorityInfo.color 
          }}
        >
          <span className={styles.priorityEmoji}>{priorityInfo.emoji}</span>
          <span className={styles.priorityText}>{priorityInfo.label}</span>
        </div>
        <div className={task.completed ? styles.statusBadgeCompleted : styles.statusBadgePending}>
          {task.completed ? "✓ Выполнена" : "○ В работе"}
        </div>
      </div>

      {/* Заголовок */}
      <h3 className={styles.title}>{task.title}</h3>

      {/* Описание */}
      <div className={styles.description}>
        Тестовое описание: {task.description || "Нет описания"}
      </div>

      {/* Нижняя строка: исполнитель, дата, кнопка */}
      <div className={styles.bottomRow}>
        <div className={styles.metaInfo}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>👤</span>
            <span className={styles.metaText}>{userName}</span>
          </span>
          <span className={styles.separator}>|</span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>📅</span>
            <span className={styles.metaText}>{formattedDate}</span>
          </span>
        </div>

        <Link to={`/task/${task.id}`} className={styles.viewButton}>
          Просмотр →
        </Link>
      </div>
    </div>
  );
};

// Функция для сравнения пропсов
const arePropsEqual = (prevProps: TaskCardProps, nextProps: TaskCardProps) => {
  // Сравниваем только необходимые поля задачи
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.completed === nextProps.task.completed &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.index === nextProps.index
  );
};

// Экспортируем мемоизированный компонент
export const TaskCard = memo(TaskCardComponent, arePropsEqual);
