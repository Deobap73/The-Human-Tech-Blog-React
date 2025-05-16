// The-Human-Tech-Blog-React/src/shared/context/ThemeProvider.tsx

import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeContextType } from '../types';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const defaultTheme = storedTheme || 'light';
    setTheme(defaultTheme);
    document.body.setAttribute('data-theme', defaultTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
