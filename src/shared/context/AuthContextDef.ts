// The-Human-Tech-Blog-React/src/shared/context/AuthContextDef.ts

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
  login: (email: string, password: string, captcha?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: Record<string, any>) => Promise<any>;
  refetchUser: () => Promise<void>;
  getAccessTokenSecurely: () => Promise<void>;
}
