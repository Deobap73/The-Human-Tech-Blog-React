// /src/features/chat/pages/ChatRoutes.tsx

import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatSidebar from '../components/ ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import '../styles/ChatPage.scss';

// Custom hook para detectar mobile
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
  const location = useLocation();

  // Estado para conversa seleccionada (só desktop/tablet)
  const [selectedConversation, setSelectedConversation] = useState<string>('');

  // Quando usuário seleciona uma conversa:
  const handleSelect = (id: string) => {
    if (isMobile) {
      // Navega para rota só do ChatWindow
      navigate(`${id}`);
    } else {
      setSelectedConversation(id);
    }
  };

  // Opcional: se voltar ao /chat, limpa a conversa seleccionada em desktop
  useEffect(() => {
    if (!isMobile && location.pathname.match(/\/chat\/?$/)) {
      setSelectedConversation('');
    }
  }, [isMobile, location.pathname]);

  return (
    <div className='chat-page'>
      <ChatSidebar onSelect={handleSelect} />
      {!isMobile && <ChatWindow conversationId={selectedConversation} />}
    </div>
  );
};

// Página só do ChatWindow (mobile)
const ChatWindowPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  return (
    <div className='chat-page chat-page--window-only'>
      <ChatWindow conversationId={conversationId || ''} />
    </div>
  );
};

const ChatRoutes = () => (
  <Routes>
    {/* Sidebar (e ChatWindow em desktop/tablet) */}
    <Route path='/' element={<ChatLayout />} />
    {/* Mobile: só ChatWindow */}
    <Route path='/:conversationId' element={<ChatWindowPage />} />
  </Routes>
);

export default ChatRoutes;
