//  The-Human-Tech-Blog-React/src/context/AuthContextDef.ts

import { RegisterPayload } from '../services/authService';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'editor';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<any>;
  refetchUser: () => Promise<void>;
  getAccessTokenSecurely: () => Promise<void>;
}
