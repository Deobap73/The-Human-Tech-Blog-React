// src/shared/context/SocketContext.tsx

import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';

export interface SocketContextValue {
  socket: Socket | null;
  sendMessage: (conversationId: string, text: string) => void;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  sendMessage: () => {},
});

export const useSocketContext = () => useContext(SocketContext);
