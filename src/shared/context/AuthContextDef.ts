// ✅ The-Human-Tech-Blog-React/src/context/AuthContextDef.ts

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  getAccessTokenSecurely: () => Promise<void>;
}
