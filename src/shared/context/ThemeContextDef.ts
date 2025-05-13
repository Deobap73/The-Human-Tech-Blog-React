// The-Human-Tech-Blog-React\src\context\ThemeContextDef.ts

import { createContext } from 'react';
import { ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
