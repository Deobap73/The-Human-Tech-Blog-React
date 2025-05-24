// src/features/user/pages/UserPage.tsx

import UserProfileInfo from '../components/UserProfileInfo';
import UserPostsList from '../components/UserPostsList';
import UserBookmarksList from '../components/UserBookmarksList';
import UserCommentsList from '../components/UserCommentsList';

const UserPage = () => (
  <div className='user-page'>
    <UserProfileInfo />
    <UserPostsList />
    <UserBookmarksList />
    <UserCommentsList />
  </div>
);

export default UserPage;
