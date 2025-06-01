// The-Human-Tech-Blog-React/src/features/post/components/RecentPosts.tsx

import '../styles/RecentPosts.scss';

import { Card } from './Card';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';

interface RecentPostsProps {
  posts: Post[];
  lang: string;
}

/**
 * RecentPosts component: renders the 4 most recent posts in a 2x2 responsive grid.
 */
export const RecentPosts = ({ posts, lang }: RecentPostsProps) => {
  // Filter and slice to 4 posts
  const validPosts = posts.filter((post) => isValidPost(post, lang)).slice(0, 4);

  if (validPosts.length === 0) return null;

  return (
    <section className='recentPosts__container'>
      <div className='recentPosts__introduction'>
        <h2 className='recentPosts__title'>Human Tech em Foco: As Últimas Reflexões e Insights!</h2>
        <p className='recentPosts__description'>
          Mergulhe nas intersecções entre o universo digital e a experiência humana. Aqui, você
          encontra os quatro posts mais recentes, com insights sobre gestão de projetos, frontend,
          UI/UX, Scrum, e como a tecnologia molda a nossa vida.
        </p>
      </div>
      <div className='recentPosts__grid'>
        {validPosts.map((post) => (
          <Card key={post._id} post={post} lang={lang} />
        ))}
      </div>
    </section>
  );
};
