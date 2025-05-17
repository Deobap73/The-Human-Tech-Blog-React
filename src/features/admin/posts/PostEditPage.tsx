// src/features/admin/posts/PostEditPage.tsx
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { Post } from '../../../shared/types/Post';

interface FormData {
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
}

const PostEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get<Post>(`/posts/${id}`);
        reset({
          title: res.data.title,
          content: res.data.content || '',
          status: res.data.status,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch post data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.patch(`/posts/${id}`, data);
      navigate('/admin/posts');
    } catch (err) {
      console.error(err);
      setError('Failed to update post');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='post-edit-form'>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label>
          <input {...register('title', { required: 'Title is required' })} />
          {errors.title && <span>{errors.title.message}</span>}
        </div>

        <div>
          <label>Content</label>
          <textarea {...register('content', { required: 'Content is required' })} />
          {errors.content && <span>{errors.content.message}</span>}
        </div>

        <div>
          <label>Status</label>
          <select {...register('status', { required: true })}>
            <option value='draft'>Draft</option>
            <option value='published'>Published</option>
            <option value='archived'>Archived</option>
          </select>
        </div>

        <button type='submit' disabled={isSubmitting}>
          Save
        </button>
      </form>
    </div>
  );
};

export default PostEditPage;
