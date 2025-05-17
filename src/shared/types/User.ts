// src/shared/types/User.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  avatar?: string;
}
