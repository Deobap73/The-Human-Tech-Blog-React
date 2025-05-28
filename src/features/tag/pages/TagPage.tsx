// The-Human-Tech-Blog-React/src/features/tag/pages/TagPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostsByTag } from '../../../shared/services/tagService';
import { Post } from '../../../shared/types/Post';

const TagPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getPostsByTag(slug)
        .then(setPosts)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!posts.length) return <p>No posts found for this tag.</p>;

  return (
    <div>
      <h2>Posts tagged with "{slug}"</h2>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TagPage;
