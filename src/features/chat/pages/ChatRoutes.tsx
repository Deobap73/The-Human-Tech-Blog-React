// /src/features/chat/pages/ChatRoutes.tsx
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatSidebar from '../components/ ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import '../styles/ChatPage.scss';

// Custom hook for responsive detection (tablet breakpoint)
function useIsTablet(breakpoint = 1024) {
  const [isTablet, setIsTablet] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsTablet(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isTablet;
}

const ChatLayout = () => {
  const isTablet = useIsTablet();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected conversation (only desktop)
  const [selectedConversation, setSelectedConversation] = useState<string>('');

  // On conversation select: desktop updates state, tablet/mobile navigates
  const handleSelect = (id: string) => {
    if (isTablet) {
      navigate(`${id}`);
    } else {
      setSelectedConversation(id);
    }
  };

  // Clear selection on route change (desktop)
  useEffect(() => {
    if (!isTablet && location.pathname.match(/\/chat\/?$/)) {
      setSelectedConversation('');
    }
  }, [isTablet, location.pathname]);

  return (
    <div className='chat-page'>
      <ChatSidebar onSelect={handleSelect} />
      {/* Show ChatWindow only on desktop */}
      {!isTablet && <ChatWindow conversationId={selectedConversation} />}
    </div>
  );
};

// Only ChatWindow (tablet/mobile)
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
    {/* Desktop/tablet root */}
    <Route path='/' element={<ChatLayout />} />
    {/* Tablet/mobile: ChatWindow only */}
    <Route path='/:conversationId' element={<ChatWindowPage />} />
  </Routes>
);

export default ChatRoutes;
