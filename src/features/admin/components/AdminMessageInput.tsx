// src/features/admin/components/AdminMessageInput.tsx
import { useState } from 'react';
import api from '../../../shared/utils/axios';
import { useAuth } from '../../../shared/hooks/useAuth';

interface Props {
  conversationId: string;
  onSent: () => void;
}

const AdminMessageInput = ({ conversationId, onSent }: Props) => {
  const { user } = useAuth();
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await api.post('/api/messages', {
        conversationId,
        text,
        sender: user?._id,
      });
      setText('');
      onSent();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className='admin-message-input'>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type your message...'
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default AdminMessageInput;
