import type { NewTask, Task, UpdateTask } from '../types/task';
import { createId } from '../utils/createId';

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(data: NewTask): Promise<Task>;
  update(id: string, data: UpdateTask): Promise<Task>;
  remove(id: string): Promise<void>;
}

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[];

  constructor(initialTasks: Task[] = []) {
    this.tasks = [...initialTasks];
  }

  async getAll(): Promise<Task[]> {
    return [...this.tasks];
  }

  async create(data: NewTask): Promise<Task> {
    const created: Task = {
      ...data,
      id: createId(),
      completed: data.completed ?? false,
      createdAt: data.createdAt ?? new Date().toISOString(),
    };
    this.tasks = [created, ...this.tasks];
    return created;
  }

  async update(id: string, data: UpdateTask): Promise<Task> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('La tarea ya no existe.');
    }
    const updated: Task = { ...this.tasks[index], ...data };
    this.tasks[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    const exists = this.tasks.some((t) => t.id === id);
    if (!exists) {
      throw new Error('La tarea ya no existe.');
    }
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}