// src/shared/context/SocketContext.tsx

import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';

export interface Notification {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface SocketContextValue {
  socket: Socket | null;
  sendMessage: (conversationId: string, text: string) => void;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  sendMessage: () => {},
  notifications: [],
  markAsRead: () => {},
  deleteNotification: () => {},
});

export const useSocketContext = () => useContext(SocketContext);
