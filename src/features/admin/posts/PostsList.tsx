// ./src/features/admin/posts/PostsList.tsx
'use strict';

import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import type { Post } from '../../../shared/types/Post';
import '../styles/PostsList.scss';
import { toast } from 'react-hot-toast';
import { deletePost } from '../../../shared/services/postService';

const DEFAULT_LANG = 'en';

const PostsList = () => {
  const navigate = useNavigate();
  const { lang = DEFAULT_LANG } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/posts`,
        { credentials: 'include' },
      );

      if (!res.ok) {
        toast.error('Failed to load posts');
        return;
      }

      const data = (await res.json()) as Post[];
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      toast.error('Failed to load posts');
    }
  };

  const handleDeletePost = async (id: string): Promise<void> => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch (err) {
      console.error('Failed to delete post', err);
      toast.error('Failed to delete post');
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  return (
    <div className='posts-list'>
      <h2 className='posts-list__title'>Admin Post List</h2>

      <button className='posts-list__create-btn' onClick={() => navigate(`/${lang}/write`)}>
        Create New Post
      </button>

      <ul className='posts-list__items'>
        {posts.map((post) => (
          <li key={post._id} className='posts-list__item'>
            <h3 className='posts-list__post-title'>
              {post.translations?.[DEFAULT_LANG]?.title || ''}
            </h3>

            <p className='posts-list__status'>
              <strong>Status:</strong>{' '}
              <span className={`posts-list__status-text posts-list__status-text--${post.status}`}>
                {post.status}
              </span>
            </p>

            <div className='posts-list__actions'>
              <Link className='posts-list__edit-btn' to={`/${lang}/write/${post._id}`}>
                Edit
              </Link>

              <button
                className='posts-list__delete-btn'
                onClick={() => void handleDeletePost(post._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
