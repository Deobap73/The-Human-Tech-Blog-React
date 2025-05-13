// src/shared/socket.ts
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/auth';

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    const token = getAccessToken();
    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
