import React, { ReactNode, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes } from '../styles/theme';
import type { CategoryFilter } from '../types';
import { ThemeContext } from './contexts';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const theme = themes[category];

  const value = useMemo(
    () => ({ theme, category, setCategory }),
    [theme, category]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
