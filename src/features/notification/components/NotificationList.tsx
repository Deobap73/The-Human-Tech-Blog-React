// src/features/notification/components/NotificationList.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';

interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  return (
    <ul className='notification-list'>
      {notifications.map((n) => (
        <li key={n._id} className={`notification-item ${n.isRead ? 'read' : 'unread'}`}>
          <span>{n.message}</span>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
        </li>
      ))}
      {notifications.length === 0 && <li>No notifications</li>}
    </ul>
  );
};

export default NotificationList;
