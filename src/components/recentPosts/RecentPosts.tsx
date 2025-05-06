// The-Human-Tech-Blog-React/src/components/recentPosts/RecentPosts.tsx

import './RecentPosts.scss';
import { Card } from '../card/Card';
import { Post } from '../../types/Post';
import { isValidPost } from '../../utils/validation';

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
