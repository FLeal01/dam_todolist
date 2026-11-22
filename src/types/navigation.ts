import type { Task } from './task';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TaskList: undefined;
  // Sin task = crear tarea. Con task = editar tarea.
  TaskForm: { task?: Task } | undefined;
};
