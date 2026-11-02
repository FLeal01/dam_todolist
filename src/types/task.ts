export type Task = {
  id: string;
  title: string;
  description: string;
};

export type NewTask = Omit<Task, 'id'>;
export type TaskUpdate = Partial<NewTask>;
