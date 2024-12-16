import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { themes } from '../styles/theme';

export type Theme = typeof themes.soups;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  category: RecipeCategory;
  setCategory: (category: RecipeCategory) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [category, setCategory] = useState<RecipeCategory>('mainDishes');
  const [theme, setTheme] = useState<Theme>(themes[category]);

  useEffect(() => {
    setTheme(themes[category]);
  }, [category]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, category, setCategory }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
