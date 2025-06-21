// /src/features/chat/pages/ChatRoutes.tsx
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatSidebar from '../components/ ChatSidebar';
import ChatWindow from '../components/ChatWindow';

// Helper para detectar mobile
function useIsMobile(breakpoint = 700) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

const ChatLayout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Estado usado só para Desktop (não interfere em mobile)
  const [selectedConversation, setSelectedConversation] = useState<string>('');

  // O handler de seleção para Sidebar
  const handleSelect = (id: string) => {
    if (isMobile) {
      // Navega para /chat/:id
      navigate(`/chat/${id}`);
    } else {
      setSelectedConversation(id);
    }
  };

  return (
    <div className='chat-page'>
      <ChatSidebar onSelect={handleSelect} />
      {!isMobile && <ChatWindow conversationId={selectedConversation} />}
    </div>
  );
};

// Página apenas do ChatWindow para mobile
const ChatWindowPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  return <ChatWindow conversationId={conversationId || ''} />;
};

const ChatRoutes = () => (
  <Routes>
    {/* Página principal do chat (Sidebar + ChatWindow ou só Sidebar em mobile) */}
    <Route path='/' element={<ChatLayout />} />
    {/* Mobile: rota só para ChatWindow */}
    <Route path='/:conversationId' element={<ChatWindowPage />} />
  </Routes>
);

export default ChatRoutes;
