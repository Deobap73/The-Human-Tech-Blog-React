// /src/features/post/pages/AdminDrafts.tsx

import { Link } from 'react-router-dom';

interface Draft {
  _id: string;
  title: string;
}

interface AdminDraftsProps {
  drafts: Draft[];
}

const AdminDrafts = ({ drafts }: AdminDraftsProps) => (
  <div>
    <h2>My Drafts</h2>
    <ul>
      {drafts.map((draft) => (
        <li key={draft._id}>
          <Link to={`/write/${draft._id}`}>{draft.title}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminDrafts;
