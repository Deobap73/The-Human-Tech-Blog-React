// The-Human-Tech-Blog-React/src/features/post/components/PostForm.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { fetchTags } from '../../../shared/services/tagService';
import { Tag } from '../../../shared/types/Tag';
import { IPost } from '../../../shared/types/Post';

interface Props {
  initialPost?: Partial<IPost>;
  onSubmit?: (data: Partial<IPost>) => void;
}

const PostForm = ({ initialPost, onSubmit }: Props) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [description, setDescription] = useState(initialPost?.description || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<string[]>(initialPost?.categories || []);
  const [status, setStatus] = useState<'draft' | 'published'>(initialPost?.status || 'draft');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => setError('Failed to load tags'));
    // Se quiseres podes também carregar as categorias
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { title, description, content, tags, categories, status };
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await api.post('/posts', data);
        navigate('/admin/posts');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save post');
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setTags(selectedOptions);
  };

  return (
    <form onSubmit={handleSubmit} className='post-form'>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        type='text'
        placeholder='Title'
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder='Description'
        value={description}
        required
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        placeholder='Content'
        value={content}
        required
        onChange={(e) => setContent(e.target.value)}
      />
      <label>
        Tags:
        <select multiple value={tags} onChange={handleTagChange}>
          {availableTags.map((tag) => (
            <option value={tag._id} key={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </label>
      {/* Aqui podes adicionar seleção de categorias também */}
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
          <option value='draft'>Draft</option>
          <option value='published'>Published</option>
        </select>
      </label>
      <button type='submit'>Save</button>
    </form>
  );
};

export default PostForm;
