// The-Human-Tech-Blog-React/src/features/post/components/RecentPosts.tsx

import '../styles/RecentPosts.scss';
import { Card } from './Card';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';

interface RecentPostsProps {
  posts: Post[];
  lang: string;
}

// RecentPosts component renders the latest four valid posts using Card components.
export const RecentPosts = ({ posts, lang }: RecentPostsProps) => {
  const validPosts = posts.filter((post) => isValidPost(post, lang));
  const postsToDisplay = validPosts.slice(0, 4);

  if (postsToDisplay.length === 0) return null;

  return (
    <div className='recentPosts'>
      {postsToDisplay.map((post) => (
        <Card key={post._id} post={post} lang={lang} />
      ))}
    </div>
  );
};
