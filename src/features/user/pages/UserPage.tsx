// src/features/user/pages/UserPage.tsx

import { useAuth } from '../../../shared/hooks/useAuth';
import BookmarkList from '../../post/components/BookmarkList'; // caminho relativo correto!
import '../styles/UserPage.scss'; // cria este ficheiro para custom styles

const UserPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='user-page__unauth'>
        <h2>You need to be logged in to view your profile.</h2>
      </div>
    );
  }

  return (
    <div className='user-page'>
      <section className='user-page__profile'>
        <div className='user-page__avatar'>
          {/* Podes personalizar o avatar depois */}
          <img
            src={`https://api.dicebear.com/8.x/identicon/svg?seed=${user._id}`}
            alt={user.name}
            width={80}
            height={80}
          />
        </div>
        <div className='user-page__info'>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          {/* <button className="user-page__edit-btn">Edit Profile</button> */}
        </div>
      </section>
      <section className='user-page__favorites'>
        <h3>My Favorite Posts</h3>
        <BookmarkList />
      </section>
    </div>
  );
};

export default UserPage;
