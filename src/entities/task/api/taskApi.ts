import { 
  useInfiniteQuery, 
  useQuery, 
  useMutation, 
  useQueryClient
} from '@tanstack/react-query';
import { Task, TaskFormData, TasksResponse } from "../model/types";

const TASK_QUERY_KEY = "tasks";
const API_BASE_URL = 'http://localhost:3003';

const fetchTasks = async (cursor = 0, limit = 20): Promise<TasksResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/tasks?_sort=id&_order=desc&_start=${cursor}&_limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ошибка при загрузке задач: ${error}`);
  }

  const tasks = await response.json();
  
  const totalCountHeader = response.headers.get('X-Total-Count');
  const total = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;

  const hasMore = cursor + tasks.length < total;

  return {
    tasks,
    hasMore,
    nextCursor: hasMore ? cursor + tasks.length : undefined,
    total,
  };
};

const fetchTask = async (id: string | number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Задача не найдена: ${error}`);
  }
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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ошибка при создании задачи: ${error}`);
  }
  return response.json();
};

const updateTask = async ({ id, ...taskData }: Partial<Task> & { id: string | number }): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ошибка при обновлении задачи: ${error}`);
  }
  return response.json();
};

const deleteTask = async (id: string | number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ошибка при удалении задачи: ${error}`);
  }
};

export const useTasksInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: [TASK_QUERY_KEY, "infinite"],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }): Promise<TasksResponse> => {
      return fetchTasks(pageParam, 20);
    },
    getNextPageParam: (lastPage: TasksResponse) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: 0,
  });
};

export const useTaskQuery = (id: string | number) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, "infinite"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: [TASK_QUERY_KEY, updatedTask.id] });
      await queryClient.cancelQueries({ queryKey: [TASK_QUERY_KEY, "infinite"] });

      const previousTask = queryClient.getQueryData([TASK_QUERY_KEY, updatedTask.id]);
      const previousInfiniteData = queryClient.getQueryData([TASK_QUERY_KEY, "infinite"]);

      if (previousTask) {
        queryClient.setQueryData([TASK_QUERY_KEY, updatedTask.id], (old: Task) => ({
          ...old,
          ...updatedTask
        }));
      }

      if (previousInfiniteData) {
        queryClient.setQueryData([TASK_QUERY_KEY, "infinite"], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              tasks: page.tasks.map((task: Task) =>
                task.id === updatedTask.id ? { ...task, ...updatedTask } : task
              )
            }))
          };
        });
      }

      return { previousTask, previousInfiniteData };
    },

    onError: (_: Error, updatedTask: Partial<Task> & { id: string | number }, context: any) => {
      if (context?.previousTask) {
        queryClient.setQueryData([TASK_QUERY_KEY, updatedTask.id], context.previousTask);
      }

      if (context?.previousInfiniteData) {
        queryClient.setQueryData([TASK_QUERY_KEY, "infinite"], context.previousInfiniteData);
      }
    },

    onSettled: (updatedTask?: Task) => {
      if (updatedTask) {
        queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, updatedTask.id] });
      }
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, "infinite"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({ queryKey: [TASK_QUERY_KEY, "infinite"] });
      await queryClient.cancelQueries({ queryKey: [TASK_QUERY_KEY, id] });

      const previousInfiniteData = queryClient.getQueryData([TASK_QUERY_KEY, "infinite"]);
      const previousTask = queryClient.getQueryData([TASK_QUERY_KEY, id]);

      if (previousInfiniteData) {
        queryClient.setQueryData([TASK_QUERY_KEY, "infinite"], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              tasks: page.tasks.filter((task: Task) => task.id !== id)
            }))
          };
        });
      }

      queryClient.removeQueries({ queryKey: [TASK_QUERY_KEY, id] });

      return { previousInfiniteData, previousTask };
    },

    onError: (_: Error, id: string | number, context: any) => {
      if (context?.previousInfiniteData) {
        queryClient.setQueryData([TASK_QUERY_KEY, "infinite"], context.previousInfiniteData);
      }

      if (context?.previousTask) {
        queryClient.setQueryData([TASK_QUERY_KEY, id], context.previousTask);
      }
    },

    onSettled: (_data: void | undefined, _error: Error | null, id: string | number) => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, "infinite"] });
      queryClient.removeQueries({ queryKey: [TASK_QUERY_KEY, id] });
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
