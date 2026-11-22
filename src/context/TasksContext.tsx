import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchExternalTasks, syncTasksWithApi } from '../services/externalTaskApi';
import { createMemoryTaskRepository } from '../services/memoryTaskRepository';
import type { TaskRepository } from '../services/taskRepository';
import type { NewTask, Task, UpdateTask } from '../types/task';
import { useAuth } from './AuthContext';

type CreateTaskInput = Omit<NewTask, 'userId' | 'completed'> & { completed?: boolean };

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
  addTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, data: UpdateTask) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  importFromApi: () => Promise<number>;
  syncToApi: () => Promise<number>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

type TasksProviderProps = {
  children: ReactNode;
  repository?: TaskRepository;
};

const defaultRepository = createMemoryTaskRepository();

export function TasksProvider({ children, repository = defaultRepository }: TasksProviderProps) {
  const { currentUser } = useAuth();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    repository
      .getAll()
      .then((all) => active && setAllTasks(all))
      .catch(() => active && setError('No se pudieron cargar las tareas.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [repository]);

  const tasks = useMemo(() => {
    if (!currentUser) return [];
    const userTasks = allTasks.filter((t) => t.userId === currentUser.id);

    return [...userTasks].sort((a, b) => {
      // 1. Las completadas van al final
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // 2. Entre pendientes, las que tienen fecha límite van primero ordenadas por la más próxima
      if (a.dueAt && b.dueAt) {
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      }
      if (a.dueAt && !b.dueAt) return -1;
      if (!a.dueAt && b.dueAt) return 1;

      // 3. Sin fecha límite: las más recién creadas arriba
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allTasks, currentUser]);

  const addTask = useCallback(
    async (data: CreateTaskInput) => {
      if (!currentUser) throw new Error('Debes iniciar sesión para crear tareas.');
      const created = await repository.create({
        ...data,
        completed: data.completed ?? false,
        syncedAt: undefined,
        userId: currentUser.id,
      });
      setAllTasks((prev) => [created, ...prev]);
    },
    [repository, currentUser],
  );

  const updateTask = useCallback(
    async (id: string, data: UpdateTask) => {
      const updated = await repository.update(id, {
        ...data,
        syncedAt: undefined,
      });
      setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    [repository],
  );

  const toggleTaskCompleted = useCallback(
    async (id: string) => {
      const current = allTasks.find((t) => t.id === id);
      if (!current) return;
      const updated = await repository.update(id, {
        completed: !current.completed,
      });
      setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    [repository, allTasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await repository.remove(id);
      setAllTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [repository],
  );

  const importFromApi = useCallback(async () => {
    if (!currentUser) throw new Error('Debes iniciar sesión para importar tareas.');
    setSyncing(true);
    try {
      const externalTasks = await fetchExternalTasks(currentUser.id, 5);
      const nowIso = new Date().toISOString();
      const createdList: Task[] = [];
      for (const item of externalTasks) {
        const created = await repository.create({
          ...item,
          completed: item.completed ?? false,
          syncedAt: nowIso,
          userId: currentUser.id,
        });
        createdList.push(created);
      }
      setAllTasks((prev) => [...createdList, ...prev]);
      return createdList.length;
    } finally {
      setSyncing(false);
    }
  }, [repository, currentUser]);

  const syncToApi = useCallback(async () => {
    if (!currentUser) throw new Error('Debes iniciar sesión para sincronizar.');
    setSyncing(true);
    try {
      const { syncedCount } = await syncTasksWithApi(currentUser.id, tasks);
      const nowIso = new Date().toISOString();

      // Actualizamos syncedAt en el repositorio y en el estado para todas las tareas del usuario
      const updatedMap = new Map<string, Task>();
      for (const t of tasks) {
        const updated = await repository.update(t.id, { syncedAt: nowIso });
        updatedMap.set(t.id, updated);
      }

      setAllTasks((prev) => prev.map((t) => updatedMap.get(t.id) ?? t));
      return syncedCount;
    } finally {
      setSyncing(false);
    }
  }, [repository, currentUser, tasks]);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      syncing,
      error,
      addTask,
      updateTask,
      toggleTaskCompleted,
      deleteTask,
      importFromApi,
      syncToApi,
    }),
    [
      tasks,
      loading,
      syncing,
      error,
      addTask,
      updateTask,
      toggleTaskCompleted,
      deleteTask,
      importFromApi,
      syncToApi,
    ],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de TasksProvider.');
  return ctx;
}