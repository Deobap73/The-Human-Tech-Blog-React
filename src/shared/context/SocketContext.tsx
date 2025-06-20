// The-Human-Tech-Blog-React/src/shared/context/SocketContext.tsx
import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { Notification, ReactionUpdate, ChatMessage } from '../types'; // Ajuste o caminho conforme necessário

interface SocketActions {
  sendMessage: (conversationId: string, text: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  reactionUpdates: ReactionUpdate | null;
  lastMessage?: ChatMessage | null;
}

export interface SocketContextValue extends SocketState, SocketActions {
  // Métodos adicionais podem ser incluídos aqui
}

const defaultState: SocketState = {
  socket: null,
  isConnected: false,
  notifications: [],
  reactionUpdates: null,
  lastMessage: null,
};

const defaultActions: SocketActions = {
  sendMessage: () => console.warn('SocketContext not initialized'),
  joinConversation: () => console.warn('SocketContext not initialized'),
  leaveConversation: () => console.warn('SocketContext not initialized'),
  markNotificationAsRead: async () => console.warn('SocketContext not initialized'),
  deleteNotification: async () => console.warn('SocketContext not initialized'),
};

export const SocketContext = createContext<SocketContextValue>({
  ...defaultState,
  ...defaultActions,
});

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export type SocketProviderProps = {
  children: React.ReactNode;
};
