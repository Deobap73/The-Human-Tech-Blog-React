// src/shared/hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/auth';
import type { ChatMessage } from '../types/ChatMessage';

let globalSocket: Socket | null = null;

const logSocketEvent = (event: string, payload?: unknown) => {
  if (import.meta.env.MODE === 'development') {
    console.log(`[socket] ${event}`, payload ?? '');
  }
};

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const enabled = String(import.meta.env.VITE_ENABLE_SOCKET ?? 'false') === 'true';
    if (!enabled) {
      logSocketEvent('disabled via VITE_ENABLE_SOCKET');
      return;
    }

    if (!globalSocket || globalSocket.disconnected) {
      const token = getAccessToken();

      const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || '';

      if (!socketUrl) {
        console.error('Socket URL not configured');
        return;
      }

      globalSocket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        path: '/socket.io',
      });

      socketRef.current = globalSocket;

      globalSocket.on('connect', () => {
        logSocketEvent('connected', globalSocket?.id);
        setIsConnected(true);
      });

      globalSocket.on('disconnect', () => {
        logSocketEvent('disconnected');
        setIsConnected(false);
      });

      globalSocket.on('connect_error', (err) => {
        logSocketEvent('connect_error', err.message);
      });

      globalSocket.on('message:new', (msg: ChatMessage) => {
        logSocketEvent('message:new', msg);
      });
    }

    return () => {
      socketRef.current = null;
    };
  }, []);

  const sendMessage = (conversationId: string, text: string) => {
    if (globalSocket?.connected) {
      globalSocket.emit('message:create', { conversationId, text }, (ack: any) => {
        logSocketEvent('message:ack', ack);
      });
    } else {
      console.error('Cannot send message, socket not connected');
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
  };
};
