// The-Human-Tech-Blog-React/src/features/chat/components/MessageList.tsx

import { useEffect, useState, useRef } from 'react';
import api from '../../../shared/utils/axios';
import { useSocketContext } from '../../../shared/context/SocketContext';

interface Message {
  _id: string;
  sender: { _id: string; name: string; role: string };
  text: string;
  createdAt: string;
}

const MessageList = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocketContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api.get(`/messages/${conversationId}`).then((res) => setMessages(res.data));
    // Listen for new messages via socket
    socket?.emit('chat:join', conversationId);
    const handler = (msg: Message) => setMessages((m) => [...m, msg]);
    socket?.on('chat:newMessage', handler);
    return () => {
      socket?.emit('chat:leave', conversationId);
      socket?.off('chat:newMessage', handler);
    };
  }, [conversationId, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.sender.role}`}>
          <b>{msg.sender.name}</b>: {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
