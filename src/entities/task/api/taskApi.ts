import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task, TaskFormData, TasksResponse } from "../model/types";

const TASK_QUERY_KEY = "tasks";
const API_BASE_URL = "/api";

// API функции
const fetchTasks = async (cursor = 0, limit = 20): Promise<TasksResponse> => {
  // Json-server использует _page и _limit для пагинации
  const page = Math.floor(cursor / limit) + 1;
  const response = await fetch(`${API_BASE_URL}/tasks?_page=${page}&_limit=${limit}`);
  if (!response.ok) throw new Error("Ошибка при загрузке задач");
  const tasks = await response.json();
  
  // Получаем общее количество из заголовка
  const total = parseInt(response.headers.get('X-Total-Count') || '100', 10);
  const hasMore = cursor + limit < total;
  
  return {
    tasks,
    hasMore,
    nextCursor: hasMore ? cursor + limit : cursor,
    total,
  };
};

const fetchTask = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
  if (!response.ok) throw new Error("Задача не найдена");
  return response.json();
};

const createTask = async (taskData: TaskFormData): Promise<Task> => {
  const newTask = {
    ...taskData,
    completed: taskData.completed || false,
    priority: taskData.priority || "medium",
    createdAt: new Date().toISOString(),
    userId: 1,
  };
  
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });
  
  if (!response.ok) throw new Error("Ошибка при создании задачи");
  return response.json();
};

const updateTask = async ({ id, ...taskData }: Partial<Task> & { id: number }): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  
  if (!response.ok) throw new Error("Ошибка при обновлении задачи");
  return response.json();
};

const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) throw new Error("Ошибка при удалении задачи");
};

// React Query хуки
export const useTasksInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: [TASK_QUERY_KEY, "infinite"],
    queryFn: async ({ pageParam = 0 }): Promise<TasksResponse> => {
      return fetchTasks(pageParam, 20);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: 0,
  });
};

export const useTaskQuery = (id: number) => {
  return useQuery({
    queryKey: [TASK_QUERY_KEY, id],
    queryFn: () => fetchTask(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => { console.log("useCreateTask: инвалидируем кэш задач");
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY], refetchType: "all" });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, updatedTask.id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => { console.log("useCreateTask: инвалидируем кэш задач");
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY], refetchType: "all" });
    },
  });
};

export const taskApi = {
  fetchTasks,
  fetchTask,
  createTask,
  updateTask,
  deleteTask,
};
