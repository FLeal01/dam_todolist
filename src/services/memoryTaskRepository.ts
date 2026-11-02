import type { NewTask, Task, TaskUpdate } from '../types/task';
import type { TaskRepository } from './taskRepository';
import { createId } from '../utils/createId';

export function createMemoryTaskRepository(initial: Task[] = []): TaskRepository {
  let items: Task[] = [...initial];

  return {
    async getAll() {
      return [...items];
    },
    async create(data: NewTask) {
      const task: Task = { id: createId(), ...data };
      items = [task, ...items];
      return task;
    },
    async update(id: string, data: TaskUpdate) {
      const current = items.find((t) => t.id === id);
      if (!current) throw new Error('La tarea no existe.');
      const updated: Task = { ...current, ...data };
      items = items.map((t) => (t.id === id ? updated : t));
      return updated;
    },
    async remove(id: string) {
      items = items.filter((t) => t.id !== id);
    },
  };
}
