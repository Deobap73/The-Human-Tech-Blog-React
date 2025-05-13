// src/shared/types/ChatMessage.ts

export interface ChatMessage {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
}
