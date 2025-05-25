// The-Human-Tech-Blog-React/src/features/post/components/PostList.tsx

import { useEffect, useState } from 'react';
import { fetchTags } from '../../../shared/services/tagService';
import { Tag } from '../../../shared/types/Tag';
import { IPost } from '../../../shared/types/Post';

const PostList = ({ posts }: { posts: IPost[] }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchTags().then(setTags);
  }, []);

  const tagMap = Object.fromEntries(tags.map((t) => [t._id, t]));

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <h3>{post.title}</h3>
          <div>
            {post.tags.map((tagId) => {
              const tag = tagMap[tagId];
              return tag ? (
                <span
                  key={tag._id}
                  style={{
                    background: tag.color || '#eee',
                    padding: '0 8px',
                    borderRadius: 4,
                    marginRight: 4,
                  }}>
                  {tag.name}
                </span>
              ) : null;
            })}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
