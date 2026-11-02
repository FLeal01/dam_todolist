import type { Task } from './task';

export type RootStackParamList = {
  TaskList: undefined;
  // Sin task = crear tarea. Con task = editar tarea.
  TaskForm: { task?: Task } | undefined;
};
