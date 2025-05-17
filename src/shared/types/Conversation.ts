// src/shared/types/Conversation.ts
import { User } from './User';

export interface Conversation {
  _id: string;
  participants: (User | string)[];
  createdAt: string;
  updatedAt: string;
}
