// /src/shared/types/Notification.ts

export interface NotificationTranslation {
  title: string;
  message: string;
}

export type NotificationTranslations = {
  en: NotificationTranslation;
  pt?: NotificationTranslation;
  de?: NotificationTranslation;
  es?: NotificationTranslation;
  [key: string]: NotificationTranslation | undefined;
};

export interface Notification {
  _id: string;
  translations: NotificationTranslations;
  user?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationPayload {
  translations: NotificationTranslations;
}
