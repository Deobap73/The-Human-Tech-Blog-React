/// The-Human-Tech-Blog-React/src/components/recentPosts/RecentPosts.tsx

import '../styles/RecentPosts.scss';
import { Card } from './Card';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';

export const RecentPosts = ({ posts }: { posts: Post[] }) => {
  const validPosts = posts.filter((post) => isValidPost(post));

  return (
    <div className='recentPosts'>
      {validPosts.slice(0, 4).map((post) => (
        <Card key={post._id} post={post} />
      ))}
    </div>
  );
};
