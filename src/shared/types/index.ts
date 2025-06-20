// src/types/index.ts

// src/types/index.ts
export interface User {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  desc: string;
  img?: string;
  slug: string;
  catSlug: string;
  userEmail: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Category {
  _id: string;
  name: string;
  title: string;
  slug: string;
  img?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  desc: string;
  postSlug: string;
  userEmail: string;
  createdAt: string;
  user?: User;
}

// Novas interfaces adicionadas
export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderEmail: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'reaction' | 'comment' | 'message' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    postId?: string;
    commentId?: string;
    senderId?: string;
  };
}

export interface ReactionUpdate {
  targetType: 'post' | 'comment';
  targetId: string;
  emoji: string;
  userEmail: string;
  action: 'add' | 'remove';
  timestamp: string;
}

export type Theme = 'light' | 'dark';
export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export interface ThemeColors {
  bg: string;
  textColor: string;
  softBg: string;
  softTextColor: string;
}
