// src/shared/types/AdminSettings.ts

export interface AdminSettings {
  allowUserMessaging: boolean;
  maintenanceMode: boolean;
  defaultUserRole: 'reader' | 'editor' | 'admin';
  supportEmail: string;
  analyticsEnabled: boolean;
  updatedAt: string;
  createdAt: string;
  siteTitle: string;
  enableChat: boolean;
  maxUsers: number;
}
