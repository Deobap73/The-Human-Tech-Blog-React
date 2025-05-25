// The-Human-Tech-Blog-React/src/shared/types/Comment.ts

export interface ModerationComment {
  _id: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  postId: {
    _id: string;
    title: string;
    slug?: string;
  } | null;
}
