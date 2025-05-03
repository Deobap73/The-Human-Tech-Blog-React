// The-Human-Tech-Blog-React/crs / context / ThemeContext.tsx;
import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContextDef';
import { Theme } from '../types';

const getFromLocalStorage = (): Theme => {
  if (typeof window !== 'undefined') {
    const theme = localStorage.getItem('theme');
    return theme === 'dark' ? 'dark' : 'light';
  }
  return 'light';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => getFromLocalStorage());

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
