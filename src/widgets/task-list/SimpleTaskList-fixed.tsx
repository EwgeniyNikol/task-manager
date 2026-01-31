import React, { useEffect, useState } from "react";
import { Task } from "@entities/task/model/types";
import { TaskCard } from "@entities/task/ui";

export const SimpleTaskListFixed: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tasks?_limit=20&_sort=id&_order=desc')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error: ${r.status}`);
        return r.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (tasks.length === 0) return <div>Нет задач</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Задачи ({tasks.length})</h2>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} index={0} style={{}} />
      ))}
    </div>
  );
};
