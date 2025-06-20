import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/authTokenStorage';

let socketInstance: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socketInstance || socketInstance.disconnected) {
    const token = getAccessToken();

    socketInstance = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance?.id);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
  }

  return socketInstance;
};

export const getSocket = (): Socket | null => {
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const isSocketConnected = (): boolean => {
  return socketInstance?.connected ?? false;
};
