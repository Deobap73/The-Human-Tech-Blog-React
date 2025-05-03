// The-Human-Tech-Blog-React/src/types/Post.ts

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  createdAt: Date;
  views: number;
  content?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  author?: {
    name: string;
  };
}
