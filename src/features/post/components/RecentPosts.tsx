import React, { useRef, useState, useEffect } from 'react';
import '../styles/RecentPosts.scss';
import { Card } from './Card';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import CarouselArrow from './CarouselArrow';
import { useTranslation } from 'react-i18next';

interface RecentPostsProps {
  posts: Post[];
  lang: string;
}

const VISIBLE_CARDS = 2;

export const RecentPosts = ({ posts, lang }: RecentPostsProps) => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);

  const validPosts = posts.filter((post) => isValidPost(post, lang));
  const postsToDisplay = validPosts.slice(0, 12);

  const [startIdx, setStartIdx] = useState(0);
  const maxStart = Math.max(0, postsToDisplay.length - VISIBLE_CARDS);

  const handlePrev = () => setStartIdx((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setStartIdx((prev) => Math.min(prev + 1, maxStart));

  useEffect(() => {
    if (carouselRef.current) {
      const cardEl = carouselRef.current.children[startIdx] as HTMLElement;
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  }, [startIdx]);

  if (postsToDisplay.length === 0) return null;

  return (
    <div className='recentPosts'>
      <div className='recentPosts__carouselWrapper'>
        <div className='recentPosts__carousel' ref={carouselRef}>
          {postsToDisplay.map((post) => (
            <Card key={post._id} post={post} lang={lang} />
          ))}
        </div>
      </div>
      <div className='arrow'>
        <CarouselArrow direction='left' onClick={handlePrev} disabled={startIdx === 0} />
        <CarouselArrow direction='right' onClick={handleNext} disabled={startIdx === maxStart} />
      </div>
    </div>
  );
};
