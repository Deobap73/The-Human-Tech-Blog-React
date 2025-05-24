// src/shared/context/SocketProvider.tsx

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getAccessToken } from '../utils/authTokenStorage';
import { SocketContext } from './SocketContext';
import type { ReactNode } from 'react';
import type { Socket } from 'socket.io-client';
import api from '../utils/axios';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const isConnected = useRef(false);

  // Connect socket
  useEffect(() => {
    const token = getAccessToken();
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
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

    // Listen for new notification
    newSocket.on('notification:new', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch initial notifications on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch {
        setNotifications([]);
      }
    })();
  }, []);

  // Chat message
  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      socket?.emit('message:create', { conversationId, text });
    },
    [socket]
  );

  // Notificações
  const markAsRead = useCallback(async (id: string) => {
    await api.patch(`/notifications/${id}`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    await api.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendMessage,
        notifications,
        markAsRead,
        deleteNotification,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
