import { jwtDecode } from 'jwt-decode';
import type { AuthUser } from '../types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Fired by the API layer when the server rejects the stored token.
export const AUTH_EXPIRED_EVENT = 'auth:expired';

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/** Expiry of the token in ms since epoch, or null when it is unreadable. */
export const getTokenExpiry = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return exp ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string | null): boolean => {
  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry > Date.now();
};

export const getToken = (): string | null => readStorage(TOKEN_KEY);

export const getStoredUser = (): AuthUser | null => {
  try {
    const raw = readStorage(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const saveSession = (token: string, user: AuthUser) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable (private mode): the session lasts for this tab only.
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Nothing to clear.
  }
};
