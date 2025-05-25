// The-Human-Tech-Blog-React/src/features/post/components/PostList.tsx

import { useEffect, useState } from 'react';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import { IPost } from '../../../shared/types/Post';

const PostList = ({ posts }: { posts: IPost[] }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchTags().then(setTags);
    fetchCategories().then(setCategories);
  }, []);

  const tagMap = Object.fromEntries(tags.map((t) => [t._id, t]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c._id, c]));

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <h3>{post.title}</h3>
          <div>
            {/* Exibir tags */}
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
          <div>
            {/* Exibir categorias */}
            {post.categories.map((catId) => {
              const cat = categoryMap[catId];
              return cat ? (
                <span
                  key={cat._id}
                  style={{
                    background: '#d8eafd',
                    padding: '0 8px',
                    borderRadius: 4,
                    marginRight: 4,
                  }}>
                  {cat.name}
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
