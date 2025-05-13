// src/shared/context/SocketProvider.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getAccessToken } from '../utils/auth';
import { SocketContext, SocketContextValue } from './SocketContext';
import type { ReactNode } from 'react';
import type { Socket } from 'socket.io-client';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const isConnected = useRef(false);

  useEffect(() => {
    const token = getAccessToken();
    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      isConnected.current = true;
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      isConnected.current = false;
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage: SocketContextValue['sendMessage'] = (conversationId, text) => {
    socket?.emit('message:create', { conversationId, text });
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>{children}</SocketContext.Provider>
  );
};
