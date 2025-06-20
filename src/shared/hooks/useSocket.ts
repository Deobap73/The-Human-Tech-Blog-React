// src/shared/hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/auth';
import type { ChatMessage } from '../types/ChatMessage';

// Variável global para manter a instância única do socket
let globalSocket: Socket | null = null;

const logSocketEvent = (event: string, payload?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[socket] ${event}`, payload ?? '');
  }
};

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Só cria nova conexão se não existir ou se desconectou
    if (!globalSocket || globalSocket.disconnected) {
      const token = getAccessToken();

      // Usa VITE_SOCKET_URL se disponível, caso contrário usa VITE_API_URL
      const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

      globalSocket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'], // Fallback para polling se websocket falhar
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        path: '/socket.io', // Certifique-se que corresponde ao path do servidor
      });

      socketRef.current = globalSocket;

      // Event listeners
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
      // Não desconecta o socket global aqui - mantém a conexão ativa
      // Apenas limpa a referência local
      socketRef.current = null;
    };
  }, []);

  const sendMessage = (conversationId: string, text: string) => {
    if (globalSocket?.connected) {
      globalSocket.emit('message:create', { conversationId, text }, (ack: any) => {
        logSocketEvent('message:ack', ack);
      });
    } else {
      console.error('Cannot send message - socket not connected');
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
  };
};
