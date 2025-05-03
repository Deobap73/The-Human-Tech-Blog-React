// The-Human-Tech-Blog-React\src\components\recentPosts\RecentPosts.tsx

import './RecentPosts.scss';
import { Card } from '../card/Card';
import { Post } from '../../types/Post';

export const RecentPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <div className='recentPosts'>
      {posts.slice(0, 4).map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </div>
  );
};
