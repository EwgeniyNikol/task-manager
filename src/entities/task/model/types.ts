export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  userId: number;
  priority?: TaskPriority; // Добавили приоритет
}

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface TaskFormData {
  title: string;
  description: string;
  completed?: boolean;
  priority?: TaskPriority; // Добавили приоритет
}

export interface TasksResponse {
  tasks: Task[];
  hasMore: boolean;
  nextCursor?: number;
  total: number;
}

export interface PaginationParams {
  cursor?: number;
  limit: number;
}

export type TaskStatus = "all" | "completed" | "pending";

// Новый интерфейс для опций приоритета
export interface PriorityOption {
  value: TaskPriority;
  label: string;
  color: string;
  emoji: string;
}
