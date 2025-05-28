// src/features/post/components/PostList.tsx

import { useEffect, useState } from 'react';
import { fetchTags } from '../../../shared/services/tagService';
import { fetchCategories } from '../../../shared/services/categoryService';
import { Tag } from '../../../shared/types/Tag';
import { Category } from '../../../shared/types/Category';
import { Post } from '../../../shared/types/Post';
import { useTranslation } from 'react-i18next';
import { getPostTranslation, getTagName, getCategoryName } from '../../../shared/utils/i18nHelpers';

const PostList = ({ posts }: { posts: Post[] }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchTags().then(setTags);
    fetchCategories().then(setCategories);
  }, []);

  const tagMap = Object.fromEntries(tags.map((t) => [t._id, t]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c._id, c]));

  const lang = i18n.language.split('-')[0] || 'en';

  return (
    <ul>
      {posts.map((post) => {
        const translation = getPostTranslation(post.translations, lang);

        return (
          <li key={post._id}>
            <h3>{translation.title}</h3>
            <div>
              {/* Render tags */}
              {(post.tags ?? []).map((tagId) => {
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
                    {getTagName(tag, lang)}
                  </span>
                ) : null;
              })}
            </div>
            <div>
              {/* Render categories */}
              {(post.categories ?? []).map((catId) => {
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
                    {getCategoryName(cat, lang)}
                  </span>
                ) : null;
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
