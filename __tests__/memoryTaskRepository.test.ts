import { createMemoryTaskRepository } from '../src/services/memoryTaskRepository';
import { describe, expect, test } from '@jest/globals';
describe('Repositorio de tareas en memoria', () => {
  test('crea, actualiza estado/sincronización y elimina tareas correctamente', async () => {
    const repo = createMemoryTaskRepository();

    const created = await repo.create({
      userId: 'user-1',
      title: 'Estudiar React Native',
      description: 'Repasar hooks y contexto',
      completed: false,
    });

    expect(created.id).toBeDefined();
    expect(created.createdAt).toBeDefined();
    expect(created.syncedAt).toBeUndefined();

    const now = new Date().toISOString();
    const updated = await repo.update(created.id, {
      completed: true,
      syncedAt: now,
    });

    expect(updated.completed).toBe(true);
    expect(updated.syncedAt).toBe(now);

    await repo.remove(created.id);
    const all = await repo.getAll();
    expect(all).toHaveLength(0);
  });
});