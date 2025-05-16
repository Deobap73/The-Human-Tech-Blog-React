// AuthContext.ts
import { createContext } from 'react';
import { AuthContextType } from './AuthContextDef';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
