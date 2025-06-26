import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../shared/utils/axios';
import '../styles/DraftsList.scss';

interface Draft {
  _id: string;
  translations?: {
    en?: { title?: string };
    pt?: { title?: string };
    de?: { title?: string };
    es?: { title?: string };
    [key: string]: { title?: string } | undefined;
  };
  title?: string;
}

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

  function getDraftTitle(draft: Draft) {
    if (draft.translations) {
      return (
        draft.translations.en?.title ||
        draft.translations.pt?.title ||
        draft.translations.de?.title ||
        draft.translations.es?.title ||
        '(Untitled Draft)'
      );
    }
    return draft.title || '(Untitled Draft)';
  }

  if (loading) return <p>Loading drafts...</p>;

  if (drafts.length === 0) {
    return (
      <div className='drafts-empty'>
        <p>You have no drafts yet.</p>
        <button className='create-new-btn' onClick={() => navigate('/write')}>
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
              onClick={() => navigate(`/write/${draft._id}`)}
              style={{ cursor: 'pointer', color: '#2462c2', textDecoration: 'underline' }}>
              {getDraftTitle(draft)}
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
