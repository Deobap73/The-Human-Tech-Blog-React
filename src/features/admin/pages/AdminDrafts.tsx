// ✅ The-Human-Tech-Blog-React/src/features/admin/pages/AdminDrafts.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/axios';
import { toast } from 'react-hot-toast';
import '../../../features/admin/styles/PostsList.scss';

interface Draft {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

const AdminDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    try {
      const res = await api.get('/drafts');
      setDrafts(res.data);
    } catch (err) {
      console.error('Failed to fetch drafts', err);
      toast.error('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      await api.delete(`/drafts/${id}`);
      setDrafts(drafts.filter((d) => d._id !== id));
      toast.success('Draft deleted');
    } catch (err) {
      console.error('Failed to delete draft', err);
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className='posts-list'>
      <h2>Drafts</h2>
      <button onClick={() => navigate('/admin/posts/create')} className='create-button'>
        + New Post
      </button>
      {drafts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft) => (
              <tr key={draft._id}>
                <td>{draft.title}</td>
                <td>{draft.status}</td>
                <td>{new Date(draft.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => navigate(`/admin/posts/create?draft=${draft._id}`)}>
                    Edit
                  </button>
                  <button onClick={() => deleteDraft(draft._id)} className='danger'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDrafts;
