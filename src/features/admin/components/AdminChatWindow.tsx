// src/features/admin/components/AdminChatWindow.tsx
import { useState } from 'react';
import AdminChatSidebar from './AdminChatSidebar';
import AdminMessageViewer from './AdminMessageViewer';

const AdminChatWindow = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('');

  return (
    <div className='admin-chat-window' style={{ display: 'flex', gap: '1rem' }}>
      <AdminChatSidebar onSelect={setSelectedConversation} />
      {selectedConversation ? (
        <AdminMessageViewer conversationId={selectedConversation} />
      ) : (
        <div className='chat-placeholder'>Select a conversation</div>
      )}
    </div>
  );
};

export default AdminChatWindow;
