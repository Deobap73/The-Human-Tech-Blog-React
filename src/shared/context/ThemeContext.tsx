// The-Human-Tech-Blog-React/src/shared/context/ThemeContext.tsx

import { createContext } from 'react';
import { ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
