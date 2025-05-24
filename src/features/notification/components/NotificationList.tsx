// src/features/notification/components/NotificationList.tsx

import { useSocketContext } from '../../../shared/context/SocketContext';

const NotificationList = () => {
  const { notifications, markAsRead, deleteNotification } = useSocketContext();

  return (
    <div className='notification-list'>
      <h4>Notifications</h4>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id} className={notif.isRead ? 'read' : 'unread'}>
            <span>{notif.message}</span>
            <button onClick={() => markAsRead(notif._id)}>Mark as read</button>
            <button onClick={() => deleteNotification(notif._id)}>Delete</button>
          </li>
        ))}
        {notifications.length === 0 && <li>No notifications yet.</li>}
      </ul>
    </div>
  );
};

export default NotificationList;
