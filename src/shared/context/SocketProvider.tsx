// The-Human-Tech-Blog-React/src/shared/context/SocketProvider.tsx

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/authTokenStorage';
import { SocketContext } from './SocketContext';
import type { ReactNode } from 'react';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [reactionUpdates, setReactionUpdates] = useState<any>(null);

  const { user } = useAuth();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setSocket(null);
      return;
    }
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      // Connected!
    });
    newSocket.on('disconnect', () => {
      setSocket(null);
    });

    // Real-time notifications
    newSocket.on('notification:new', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    newSocket.on('reaction:updated', (payload) => {
      setReactionUpdates({ ...payload, timestamp: Date.now() });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // --- CHAT METHODS ---

  const joinConversation = useCallback(
    (conversationId: string) => {
      socket?.emit('chat:join', conversationId);
    },
    [socket]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      socket?.emit('chat:leave', conversationId);
    },
    [socket]
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      socket?.emit('chat:message', { conversationId, text });
    },
    [socket]
  );

  // Notifications helpers (mantidos)
  const markAsRead = useCallback(async (id: string) => {
    /*...*/
  }, []);
  const deleteNotification = useCallback(async (id: string) => {
    /*...*/
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendMessage,
        joinConversation,
        leaveConversation,
        notifications,
        markAsRead,
        deleteNotification,
        reactionUpdates,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
