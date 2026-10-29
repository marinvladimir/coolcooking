import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthUser } from '../types';
import { showInfoNotification } from '../utils/notification';
import {
  AUTH_EXPIRED_EVENT,
  clearSession,
  getStoredUser,
  getToken,
  getTokenExpiry,
  isTokenValid,
  saveSession,
} from './authUtils';
import { AuthContext } from './contexts';

// setTimeout overflows above ~24.8 days.
const MAX_TIMEOUT = 2 ** 31 - 1;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    const stored = getToken();
    if (isTokenValid(stored)) return stored;
    clearSession();
    return null;
  });
  const [user, setUser] = useState<AuthUser | null>(() =>
    token ? getStoredUser() : null
  );

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    saveSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  // Log out automatically once the token expires or the server rejects it.
  useEffect(() => {
    if (!token) return;

    const expire = () => {
      logout();
      showInfoNotification('Your session has expired. Please log in again.');
    };

    const expiry = getTokenExpiry(token) ?? 0;
    const timer = window.setTimeout(
      expire,
      Math.min(Math.max(expiry - Date.now(), 0), MAX_TIMEOUT)
    );
    window.addEventListener(AUTH_EXPIRED_EVENT, expire);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(AUTH_EXPIRED_EVENT, expire);
    };
  }, [token, logout]);

  const value = useMemo(
    () => ({ isLoggedIn: Boolean(token), user, login, logout }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
