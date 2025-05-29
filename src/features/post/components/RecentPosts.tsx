// The-Human-Tech-Blog-React/src/features/post/components/RecentPosts.tsx

import '../styles/RecentPosts.scss';
import React from 'react';

import { Card } from './Card';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';

interface RecentPostsProps {
  posts: Post[];
  lang: string;
}

export const RecentPosts = ({ posts, lang }: RecentPostsProps) => {
  console.log(
    '[RecentPosts] Component rendered. Received posts count:',
    posts.length,
    'Lang:',
    lang
  ); // Initial log

  const validPosts = posts.filter((post) => {
    const isValid = isValidPost(post, lang);
    console.log(
      `[RecentPosts] Filtering post ID: ${post._id || 'N/A'} - Is valid (${lang}): ${isValid}`
    ); // Log validation status
    return isValid;
  });

  console.log('[RecentPosts] Number of valid posts after filtering:', validPosts.length); // Log valid posts count

  const postsToDisplay = validPosts.slice(0, 4);
  console.log(
    '[RecentPosts] Posts selected for display (first 4 valid posts IDs):',
    postsToDisplay.map((p) => p._id)
  ); // Log IDs to be displayed

  if (postsToDisplay.length === 0) {
    console.log('[RecentPosts] No posts to display after filtering and slicing. Returning null.'); // Log why it's returning null
    return null;
  }

  console.log(`[RecentPosts] Displaying ${postsToDisplay.length} recent posts.`); // Confirm display readiness

  return (
    <div className='recentPosts'>
      {postsToDisplay.map((post) => (
        <React.Fragment key={post._id}>
          {(() => {
            console.log(`[RecentPosts] Rendering Card for post ID: ${post._id} with lang: ${lang}`);
            return null;
          })()}
          <Card post={post} lang={lang} />
        </React.Fragment>
      ))}
    </div>
  );
};
