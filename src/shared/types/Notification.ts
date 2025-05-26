// src/shared/types/Notification.ts
export type NotificationTranslation = {
  title: string;
  message: string;
};

export type Notification = {
  _id: string;
  translations: {
    en?: NotificationTranslation;
    pt?: NotificationTranslation;
    de?: NotificationTranslation;
    es?: NotificationTranslation;
    [key: string]: NotificationTranslation | undefined;
  };
  user?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationPayload = {
  translations: Notification['translations'];
};
