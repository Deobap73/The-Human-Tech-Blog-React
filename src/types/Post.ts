// The-Human-Tech-Blog-React/src/types/Post.ts

export interface PostType {
  _id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  author?: {
    name: string;
  };
}
