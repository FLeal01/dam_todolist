export type TaskLocation = {
  latitude: number;
  longitude: number;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueAt?: string;
  syncedAt?: string;
  imageUri?: string;
  location?: TaskLocation;
};

export type NewTask = Omit<Task, 'id' | 'createdAt'> & {
  createdAt?: string;
};

export type UpdateTask = Partial<Omit<Task, 'id' | 'userId'>>;
export type TaskUpdate = UpdateTask;