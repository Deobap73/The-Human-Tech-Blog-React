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

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  textColor: string;
  softBg: string;
  softTextColor: string;
}
