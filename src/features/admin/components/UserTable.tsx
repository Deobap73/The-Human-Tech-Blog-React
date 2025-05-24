// src/features/admin/components/UserTable.tsx

import { useState } from 'react';
import EditUserRoleModal from './EditUserRoleModal';
import EditUserStatusModal from './EditUserStatusModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  avatar?: string;
}

interface Props {
  users: User[];
  onUpdated: () => void;
}

const UserTable = ({ users, onUpdated }: Props) => {
  const [roleModal, setRoleModal] = useState<{ open: boolean; user?: User }>({ open: false });
  const [statusModal, setStatusModal] = useState<{ open: boolean; user?: User }>({ open: false });

  return (
    <>
      <table className='user-table'>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Tools</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                <img
                  src={u.avatar || `https://api.dicebear.com/8.x/pixel-art/svg?seed=${u._id}`}
                  alt={u.name}
                  width={36}
                  height={36}
                  style={{ borderRadius: '50%' }}
                />
              </td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {u.role} <button onClick={() => setRoleModal({ open: true, user: u })}>Edit</button>
              </td>
              <td>
                {u.isActive ? 'Active' : 'Blocked'}{' '}
                <button onClick={() => setStatusModal({ open: true, user: u })}>Edit</button>
              </td>
              <td>{/* Outros botões (remover, ver detalhes, etc.) */}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {roleModal.open && roleModal.user && (
        <EditUserRoleModal
          userId={roleModal.user._id}
          currentRole={roleModal.user.role}
          isOpen={roleModal.open}
          onClose={() => setRoleModal({ open: false })}
          onUpdated={onUpdated}
        />
      )}
      {statusModal.open && statusModal.user && (
        <EditUserStatusModal
          userId={statusModal.user._id}
          currentStatus={!!statusModal.user.isActive}
          isOpen={statusModal.open}
          onClose={() => setStatusModal({ open: false })}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
};

export default UserTable;
