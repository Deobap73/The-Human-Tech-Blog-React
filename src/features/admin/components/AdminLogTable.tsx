//  The-Human-Tech-Blog-React/src/features/admin/components/AdminLogTable.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { formatDistanceToNow } from 'date-fns';
import '../styles/AdminLogTable.scss';

interface AdminLog {
  _id: string;
  action: string;
  description: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const AdminLogTable = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/logs');
      setLogs(res.data);
    } catch (error) {
      console.error('Failed to fetch admin logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;

  return (
    <div className='admin-log-table'>
      <h3>Admin Action Logs</h3>
      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Admin</th>
              <th>Action</th>
              <th>Description</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>
                  {log.user.name} ({log.user.email})
                </td>
                <td>{log.action}</td>
                <td>{log.description || '-'}</td>
                <td>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLogTable;
