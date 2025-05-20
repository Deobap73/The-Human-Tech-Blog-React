// src/features/post/pages/DraftsList.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Draft } from '../../../shared/types/Post';
import api from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import '../styles/DraftsList.scss';

const DraftsList = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    try {
      const res = await api.get('/drafts/me');
      setDrafts(res.data);
    } catch (err) {
      toast.error('Failed to fetch drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/drafts/${id}`);
      setDrafts((prev) => prev.filter((d) => d._id !== id));
      toast.success('Draft deleted');
    } catch (err) {
      toast.error('Failed to delete draft');
    }
  };

  if (loading) return <p>Loading drafts...</p>;

  if (drafts.length === 0) {
    return (
      <div className='drafts-empty'>
        <p>You have no drafts yet.</p>
        <button className='create-new-btn' onClick={() => navigate('/admin/posts/create')}>
          ✍️ Start a New Post
        </button>
      </div>
    );
  }

  return (
    <div className='drafts-list'>
      <h3>Your Drafts</h3>
      <ul>
        {drafts.map((draft) => (
          <li key={draft._id} className='draft-item'>
            <span
              className='draft-title'
              onClick={() => navigate(`/admin/posts/edit/${draft._id}`)}>
              {draft.title || <em>(Untitled Draft)</em>}
            </span>
            <button className='delete-btn' onClick={() => handleDelete(draft._id)}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DraftsList;
