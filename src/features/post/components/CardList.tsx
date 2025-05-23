import React from 'react';
import { Card } from './Card';
import { Post } from '../../../shared/types/Post';
import '../styles/CardList.scss';

interface CardListProps {
  posts: Post[];
}

const CardList: React.FC<CardListProps> = ({ posts }) => {
  if (!posts.length) {
    return <p className='empty-message'>No posts found.</p>;
  }

  return (
    <div className='card-list'>
      {posts.map((post) => (
        <Card key={post._id} post={post} />
      ))}
    </div>
  );
};

export default CardList;
