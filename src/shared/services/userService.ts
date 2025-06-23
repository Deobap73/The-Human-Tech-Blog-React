// /src/shared/services/userService.ts
import api from '../utils/axios';

export interface UserSummary {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
}

export const fetchUsers = async (): Promise<UserSummary[]> => {
  // Gets all users for chat purposes
  const res = await api.get<UserSummary[]>('/users');
  return res.data;
};
