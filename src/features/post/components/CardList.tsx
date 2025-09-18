// /src/features/post/components/CardList.tsx

import React from 'react';
import { Card } from './Card';
import { Post } from '../../../shared/types/Post';
import '../styles/CardList.scss';

interface CardListProps {
  posts: Post[];
  lang: string;
}

const CardList: React.FC<CardListProps> = ({ posts, lang }) => {
  if (posts.length === 0) {
    return <p className='card-list__empty'>No posts found.</p>;
  }

  return (
    <div className='card-list'>
      {posts.map((post) => (
        <Card key={post._id} post={post} lang={lang} />
      ))}
    </div>
  );
};

export default CardList;
