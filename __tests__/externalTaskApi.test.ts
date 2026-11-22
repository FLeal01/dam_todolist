import { describe, expect, jest, test } from '@jest/globals';
import { fetchExternalTasks, syncTasksWithApi } from '../src/services/externalTaskApi';

describe('Integración con API externa de tareas', () => {
  test('importa tareas transformadas al modelo local del usuario', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => [
        { id: 1, title: 'Tarea remota', completed: false },
        { id: 2, title: 'Segunda tarea', completed: true },
      ],
    })) as unknown as typeof fetch;

    const tasks = await fetchExternalTasks('user-1', 2);

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Tarea remota');
    expect(tasks[0].description).toContain('ID #1');
    expect(tasks[0].completed).toBe(false);
  });

  test('sincroniza tareas locales hacia la nube y devuelve el conteo', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: 101 }),
    })) as unknown as typeof fetch;

    const result = await syncTasksWithApi('user-1', [
      {
        id: 't-1',
        userId: 'user-1',
        title: 'Local',
        description: '',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    expect(result.syncedCount).toBe(1);
  });
});