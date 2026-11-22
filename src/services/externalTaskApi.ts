import type { NewTask, Task } from '../types/task';

// Estructura que devuelve JSONPlaceholder (puedes adaptarla si usas tu propio backend)
type ExternalTodoDTO = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const EXTERNAL_API_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Importa tareas desde una API REST externa y las mapea al modelo interno NewTask.
 */
export async function fetchExternalTasks(
  currentUserId: string,
  limit = 5,
): Promise<Omit<NewTask, 'userId'>[]> {
  const response = await fetch(`${EXTERNAL_API_URL}/todos?_limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al importar tareas.`);
  }

  const data: ExternalTodoDTO[] = await response.json();

  return data.map((item) => ({
    title: item.title.slice(0, 80),
    description: `Importada desde API externa (ID #${item.id})`,
    completed: item.completed,
  }));
}

/**
 * Sincroniza (envía) las tareas del usuario actual hacia un servicio web externo.
 */
export async function syncTasksWithApi(userId: string, tasks: Task[]): Promise<{ syncedCount: number }> {
  const response = await fetch(`${EXTERNAL_API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      userId,
      syncedAt: new Date().toISOString(),
      tasks,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al sincronizar tareas.`);
  }

  return { syncedCount: tasks.length };
}