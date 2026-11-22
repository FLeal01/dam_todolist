import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser, LoginCredentials, NewUser, User } from '../types/auth';
import { createId } from '../utils/createId';
import { hashPassword, verifyPassword } from '../utils/passwordHash';

type AuthContextValue = {
  currentUser: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: NewUser) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const INITIAL_RAW_USERS: User[] = [
  {
    id: 'user-demo-1',
    firstName: 'Usuario',
    lastName: 'Demo',
    email: 'demo@correo.cl',
    password: '', // Se rellena hasheado al iniciar
  },
];

function toAuthUser(user: User): AuthUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_RAW_USERS);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const login = useCallback(
    async ({ email, password }: LoginCredentials) => {
      const cleanEmail = email.trim().toLowerCase();
      const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!found) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      let storedHash = found.password;
      if (found.id === 'user-demo-1' && !storedHash) {
        storedHash = await hashPassword('123456');
        setUsers((prev) =>
          prev.map((u) => (u.id === found.id ? { ...u, password: storedHash } : u)),
        );
      }

      const isValid = await verifyPassword(password, storedHash);
      if (!isValid) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      setCurrentUser(toAuthUser(found));
    },
    [users],
  );

  const register = useCallback(
    async (data: NewUser) => {
      const cleanEmail = data.email.trim().toLowerCase();
      const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        throw new Error('Ya existe una cuenta registrada con ese correo.');
      }

      const hashedPassword = await hashPassword(data.password);


      const newUser: User = {
        ...data,
        id: createId(),
        email: cleanEmail,
        password: hashedPassword,
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(toAuthUser(newUser));
    },
    [users],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({ currentUser, login, register, logout }),
    [currentUser, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return ctx;
}