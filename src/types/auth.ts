export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Usuario activo en sesión (sin exponer la contraseña a las pantallas)
export type AuthUser = Omit<User, 'password'>;

// Para crear un usuario nuevo (registro)
export type NewUser = Omit<User, 'id'>;

// Para actualizar perfil 
export type UserUpdate = Partial<NewUser>;

// Para el formulario de inicio de sesión
export type LoginCredentials = {
  email: string;
  password: string;
};