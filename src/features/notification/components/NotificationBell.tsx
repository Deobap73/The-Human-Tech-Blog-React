// src/features/notification/components/NotificationBell.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';

export const NotificationBell = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const res = await api.get('/notifications');
      setCount(res.data.filter((n: any) => !n.isRead).length);
    };
    fetchUnread();
  }, []);

  return (
    <div className='notification-bell'>
      <span role='img' aria-label='bell'>
        🔔
      </span>
      {count > 0 && <span className='notification-badge'>{count}</span>}
    </div>
  );
};
