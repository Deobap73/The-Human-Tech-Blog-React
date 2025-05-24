// The-Human-Tech-Blog-React/src/shared/context/SocketProvider.tsx

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
  const [reactionUpdates, setReactionUpdates] = useState<{
    targetType: string;
    targetId: string;
    timestamp: number;
  } | null>(null);

  const isConnected = useRef(false);

  // Socket connection
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

    // Real-time notifications
    newSocket.on('notification:new', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    // Real-time reaction updates
    newSocket.on('reaction:updated', (payload) => {
      setReactionUpdates({ ...payload, timestamp: Date.now() });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch notifications once on mount
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

  // Notificações helpers
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
        reactionUpdates,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
