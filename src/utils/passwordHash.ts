import bcrypt from 'bcryptjs';
import * as Crypto from 'expo-crypto';

// Usa el generador criptográficamente seguro nativo del sistema operativo (Android / iOS / Web)
bcrypt.setRandomFallback((len: number) => {
  const bytes = Crypto.getRandomBytes(len);
  return Array.from(bytes);
});

const SALT_ROUNDS = 8;

/**
 * Genera un hash BCrypt seguro con salt de alta entropía.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compara una contraseña en texto plano contra el hash almacenado.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}