// The-Human-Tech-Blog-React/src/features/admin/pages/AdminTagsPage.tsx

import { useEffect, useState } from 'react';
import { fetchTags, createTag, deleteTag } from '../../../shared/services/tagService';
import { Tag } from '../../../shared/types/Tag';

const AdminTagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#cccccc');
  const [error, setError] = useState('');

  const loadTags = async () => {
    try {
      setTags(await fetchTags());
    } catch {
      setError('Failed to fetch tags');
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTag({ name, color });
      setName('');
      setColor('#cccccc');
      await loadTags();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create tag');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? Tags used by posts cannot be deleted.')) return;
    try {
      await deleteTag(id);
      await loadTags();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete tag');
    }
  };

  return (
    <div className='admin-tags-page'>
      <h2>Manage Tags</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input
          type='text'
          placeholder='Tag name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={50}
        />
        <input
          type='color'
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginLeft: 8, width: 40, height: 40, border: 0 }}
        />
        <button type='submit'>Create</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {tags.map((tag) => (
          <li key={tag._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span
              style={{
                background: tag.color || '#eee',
                padding: '0 8px',
                borderRadius: 4,
                marginRight: 8,
              }}>
              {tag.name}
            </span>
            <button onClick={() => handleDelete(tag._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTagsPage;
