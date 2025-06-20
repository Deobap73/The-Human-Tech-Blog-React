// src/features/reaction/hooks/useRealtimeReactions.ts

import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';

type ReactionRealtimeHandler = (event: {
  targetType: string;
  targetId: string;
  emoji?: string;
  userId?: string;
}) => void;

export function useRealtimeReactions(
  targetType: string,
  targetId: string,
  onUpdate: ReactionRealtimeHandler
) {
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handler = (event: {
      targetType: string;
      targetId: string;
      emoji?: string;
      userId?: string;
    }) => {
      if (event.targetType === targetType && event.targetId === targetId) {
        onUpdate(event);
      }
    };

    socket.on('reaction:updated', handler);

    return () => {
      socket.off('reaction:updated', handler);
    };
  }, [socket, isConnected, targetType, targetId, onUpdate]);
}
