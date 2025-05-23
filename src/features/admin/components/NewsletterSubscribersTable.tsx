import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';

const NewsletterSubscribersTable = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await api.get('/newsletter/subscribers');
        setSubscribers(res.data);
      } catch (err) {
        // handle error, show toast if desired
      }
    };
    fetchSubscribers();
  }, []);

  return (
    <div className='subscribers-table'>
      <h3>Newsletter Subscribers</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Inscribed At</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s._id}>
              <td>{s.email}</td>
              <td>{new Date(s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsletterSubscribersTable;
