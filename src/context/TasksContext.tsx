import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createMemoryTaskRepository } from '../services/memoryTaskRepository';
import type { TaskRepository } from '../services/taskRepository';
import type { NewTask, Task, TaskUpdate } from '../types/task';

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (data: NewTask) => Promise<void>;
  updateTask: (id: string, data: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

type TasksProviderProps = {
  children: ReactNode;
  repository?: TaskRepository;
};

const defaultRepository = createMemoryTaskRepository();

export function TasksProvider({ children, repository = defaultRepository }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    repository
      .getAll()
      .then((all) => active && setTasks(all))
      .catch(() => active && setError('No se pudieron cargar las tareas.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [repository]);

  const addTask = useCallback(
    async (data: NewTask) => {
      const created = await repository.create(data);
      setTasks((prev) => [created, ...prev]);
    },
    [repository],
  );

  const updateTask = useCallback(
    async (id: string, data: TaskUpdate) => {
      const updated = await repository.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    [repository],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await repository.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [repository],
  );

  const value = useMemo(
    () => ({ tasks, loading, error, addTask, updateTask, deleteTask }),
    [tasks, loading, error, addTask, updateTask, deleteTask],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de TasksProvider.');
  return ctx;
}
