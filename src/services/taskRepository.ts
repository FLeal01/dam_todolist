import type { NewTask, Task, TaskUpdate } from '../types/task';

/**
 * Contrato de acceso a datos. Hoy se implementa en memoria; en las
 * siguientes unidades habrá implementaciones locales y con API externa
 * sin tocar las pantallas.
 */
export interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(data: NewTask): Promise<Task>;
  update(id: string, data: TaskUpdate): Promise<Task>;
  remove(id: string): Promise<void>;
}
