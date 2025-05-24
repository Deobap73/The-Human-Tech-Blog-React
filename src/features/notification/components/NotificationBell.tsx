// src/features/notification/components/NotificationBell.tsx

import { useSocketContext } from '../../../shared/context/SocketContext';
import { useState } from 'react';
import NotificationList from './NotificationList';

export const NotificationBell = () => {
  const { notifications } = useSocketContext();
  const unread = notifications.filter((n) => !n.isRead).length;
  const [open, setOpen] = useState(false);

  return (
    <div className='notification-bell'>
      <button onClick={() => setOpen((o) => !o)}>
        <span role='img' aria-label='bell'>
          🔔
        </span>
        {unread > 0 && <span className='notification-bell__badge'>{unread}</span>}
      </button>
      {open && <NotificationList />}
    </div>
  );
};
