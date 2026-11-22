import { hashPassword, verifyPassword } from '../src/utils/passwordHash';
import { describe, expect, test } from '@jest/globals';
describe('Seguridad de contraseñas (BCrypt)', () => {
  test('genera un hash distinto a la contraseña original y verifica correctamente', async () => {
    const plain = 'ClaveSegura123!';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    expect(hashed.startsWith('$2')).toBe(true);

    const isValid = await verifyPassword(plain, hashed);
    const isInvalid = await verifyPassword('OtraClave999', hashed);

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });
});