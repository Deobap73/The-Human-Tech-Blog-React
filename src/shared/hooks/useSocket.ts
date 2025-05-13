// src/shared/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/auth';
import type { ChatMessage } from '../types/ChatMessage';

let socket: Socket | null = null;

const logSocketEvent = (event: string, payload?: unknown) => {
  console.log(`[socket] ${event}`, payload ?? '');
};

export const useSocket = () => {
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current) {
      const token = getAccessToken();
      socket = io(import.meta.env.VITE_API_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        logSocketEvent('connected', socket?.id);
        isConnected.current = true;
      });

      socket.on('disconnect', () => {
        logSocketEvent('disconnected');
        isConnected.current = false;
      });

      socket.on('message:new', (msg: ChatMessage) => {
        logSocketEvent('message:new', msg);
      });
    }

    return () => {
      socket?.disconnect();
      isConnected.current = false;
    };
  }, []);

  const sendMessage = (conversationId: string, text: string) => {
    if (socket?.connected) {
      socket.emit('message:create', { conversationId, text });
    }
  };

  return { socket, sendMessage };
};
