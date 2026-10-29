import { createContext, useContext } from 'react';
import type { AppTheme } from '../styles/theme';
import type { AuthUser, CategoryFilter } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  category: CategoryFilter;
  setCategory: (category: CategoryFilter) => void;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
