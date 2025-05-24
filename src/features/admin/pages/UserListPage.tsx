// src/features/admin/pages/UserListPage.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import UserTable from '../components/UserTable';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User Management</h2>
      {loading ? <p>Loading users...</p> : <UserTable users={users} onUpdated={fetchUsers} />}
    </div>
  );
};

export default UserListPage;
