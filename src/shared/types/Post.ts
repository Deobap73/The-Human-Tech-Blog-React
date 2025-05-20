// The-Human-Tech-Blog-React/src/shared/types/Post.ts

export interface Post {
  _id: string;
  title: string;
  description: string;
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
  slug: string;
  categories: {
    name: string;
    slug: string;
    logo: string;
  }[];
}

export interface Draft {
  _id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  tags?: string[];
  createdAt: Date;
}
