// src/shared/types/ChatMessage.ts
import { User } from './User';

export interface ChatMessage {
  _id: string;
  text: string;
  sender: string | User;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}
