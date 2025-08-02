// File: src/shared/context/SocketProvider.tsx

import React, { useEffect, useRef, useState, useMemo, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/authTokenStorage';
import { SocketContext, type SocketContextValue } from './SocketContext';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [reactionUpdates, setReactionUpdates] = useState<any>(null);
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

    if (!socketRef.current || socketRef.current.disconnected) {
      const baseUrl = import.meta.env.VITE_SOCKET_URL
        ? import.meta.env.VITE_SOCKET_URL
        : import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')
        : window.location.origin;

      const newSocket: Socket = io(baseUrl, {
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
      // keep connection alive
    };
  }, [user]);

  const value: SocketContextValue = useMemo(
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
        socket?.emit('notification:read', id);
      },
      deleteNotification: async (id: string) => {
        socket?.emit('notification:delete', id);
      },
      markNotificationAsRead: async (id: string) => {
        socket?.emit('notification:read', id);
      },
    }),
    [socket, isConnected, notifications, reactionUpdates]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
