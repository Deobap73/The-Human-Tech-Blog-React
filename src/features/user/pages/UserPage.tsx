// src/features/user/pages/UserPage.tsx

import UserProfileInfo from '../components/UserProfileInfo';
import UserPostsList from '../components/UserPostsList';
import UserBookmarksList from '../components/UserBookmarksList';
import UserCommentsList from '../components/UserCommentsList';
import '../styles/UserPage.scss';

const UserPage = () => (
  <main className='user-page'>
    <section className='user-page__card'>
      <UserProfileInfo />
    </section>
    <section className='user-page__card user-page__card--list'>
      <UserPostsList />
    </section>
    <section className='user-page__card user-page__card--list'>
      <UserBookmarksList />
    </section>
    <section className='user-page__card user-page__card--list'>
      <UserCommentsList />
    </section>
  </main>
);

export default UserPage;
