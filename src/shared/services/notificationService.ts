// src/shared/services/notificationService.ts
import api from '../utils/axios';
import { Notification, NotificationPayload } from '../types/Notification';

export const fetchNotifications = (): Promise<Notification[]> =>
  api.get('/notifications').then((res) => res.data);

export const createNotification = (data: NotificationPayload) =>
  api.post('/notifications', data).then((res) => res.data);

export const updateNotification = (id: string, data: NotificationPayload) =>
  api.patch(`/notifications/${id}`, data).then((res) => res.data);

export const deleteNotification = (id: string) =>
  api.delete(`/notifications/${id}`).then((res) => res.data);
