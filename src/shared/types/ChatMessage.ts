// /src/shared/types/ChatMessage.ts

export interface ChatMessage {
  _id: string;
  conversation: string;
  sender: string | { _id: string; name: string; avatar?: string; role?: string };
  text: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;

  // Optional attachment fields — MUST match your backend Message model!
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
}
