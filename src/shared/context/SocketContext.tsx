// The-Human-Tech-Blog-React/src/shared/context/SocketContext.tsx

import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';

export interface SocketContextValue {
  socket: Socket | null;
  sendMessage: (conversationId: string, text: string) => void;
  notifications: any[];
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  reactionUpdates: { targetType: string; targetId: string; timestamp: number } | null;
}

// Valores default são funções vazias ou arrays vazios
export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  sendMessage: () => {},
  notifications: [],
  markAsRead: async () => {},
  deleteNotification: async () => {},
  reactionUpdates: null,
});

export const useSocketContext = () => useContext(SocketContext);
