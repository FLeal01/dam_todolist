export type PasswordRule = {
  id: string;
  label: string;
  valid: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Evalúa en tiempo real los requisitos de complejidad de la contraseña.
 */
export function evaluatePasswordRules(password: string): PasswordRule[] {
  return [
    {
      id: 'length',
      label: 'Mínimo 8 caracteres',
      valid: password.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'Al menos una letra mayúscula (A-Z)',
      valid: /[A-Z]/.test(password),
    },
    {
      id: 'lowercase',
      label: 'Al menos una letra minúscula (a-z)',
      valid: /[a-z]/.test(password),
    },
    {
      id: 'number',
      label: 'Al menos un número (0-9)',
      valid: /\d/.test(password),
    },
    {
      id: 'symbol',
      label: 'Al menos un símbolo (!@#$%^&*...)',
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

export function isPasswordStrong(password: string): boolean {
  return evaluatePasswordRules(password).every((rule) => rule.valid);
}