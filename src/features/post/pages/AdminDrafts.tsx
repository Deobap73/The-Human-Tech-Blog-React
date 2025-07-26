// /src/features/post/pages/AdminDrafts.tsx

import { Helmet } from 'react-helmet-async';
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
    <Helmet>
      <meta name='robots' content='noindex, nofollow' />
    </Helmet>

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
