// The-Human-Tech-Blog-React/src/shared/context/ThemeProvider.tsx

import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeContextType } from '../types';

/**
 * ThemeProvider: Manages light/dark theme state and ensures the default is always dark mode.
 * Applies [data-theme="dark"] to <body> on first load, unless the user has set a preference.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // DEFAULT is always dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Read previous user preference, but default to dark
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const defaultTheme = storedTheme || 'dark'; // Always fall back to dark!
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
