// The-Human-Tech-Blog-React\src\shared\context\AuthContext.tsx
import { createContext } from 'react';
import { AuthContextType } from './AuthContextDef';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
