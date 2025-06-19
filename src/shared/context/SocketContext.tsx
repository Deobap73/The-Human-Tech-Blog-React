// The-Human-Tech-Blog-React/src/shared/context/SocketContext.tsx

import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';

export interface SocketContextValue {
  socket: Socket | null;
  sendMessage: (conversationId: string, text: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  notifications: any[];
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  reactionUpdates: any;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  sendMessage: () => {},
  joinConversation: () => {},
  leaveConversation: () => {},
  notifications: [],
  markAsRead: async () => {},
  deleteNotification: async () => {},
  reactionUpdates: null,
});

export const useSocketContext = () => useContext(SocketContext);
