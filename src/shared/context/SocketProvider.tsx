// The-Human-Tech-Blog-React/src/shared/context/SocketProvider.tsx

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/authTokenStorage';
import { SocketContext } from './SocketContext';
import type { ReactNode } from 'react';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [reactionUpdates, setReactionUpdates] = useState<any>(null);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Só cria nova conexão se não existir ou se desconectou
    if (!socketRef.current || socketRef.current.disconnected) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL, {
        auth: { token },
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      newSocket.on('notification:new', (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });

      newSocket.on('reaction:updated', (payload) => {
        setReactionUpdates({ ...payload, timestamp: Date.now() });
      });
    }

    return () => {
      // Não desconecta o socket global aqui - mantém a conexão ativa
      // Apenas limpa os listeners específicos se necessário
    };
  }, [user]);

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      notifications,
      reactionUpdates,
      sendMessage: (conversationId: string, text: string) => {
        socket?.emit('chat:message', { conversationId, text });
      },
      joinConversation: (conversationId: string) => {
        socket?.emit('chat:join', conversationId);
      },
      leaveConversation: (conversationId: string) => {
        socket?.emit('chat:leave', conversationId);
      },
      markAsRead: async (id: string) => {
        // Implementação existente
      },
      deleteNotification: async (id: string) => {
        // Implementação existente
      },
    }),
    [socket, isConnected, notifications, reactionUpdates]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
