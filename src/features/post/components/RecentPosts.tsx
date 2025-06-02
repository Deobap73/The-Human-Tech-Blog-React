// The-Human-Tech-Blog-React/src/features/post/components/RecentPosts.tsx

import '../styles/RecentPosts.scss';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { isValidPost } from '../../../shared/utils/validation';
import { Link } from 'react-router-dom';

interface RecentPostsProps {
  posts: Post[];
  lang: string;
}

function getCategoryLogo(category: string | Category | undefined): string {
  if (
    typeof category === 'object' &&
    category !== null &&
    'logo' in category &&
    typeof category.logo === 'string' &&
    category.logo
  ) {
    return category.logo;
  }
  return '/default-logo.png';
}

function getCategoryName(category: string | Category | undefined, lang: string): string {
  if (
    typeof category === 'object' &&
    category !== null &&
    'translations' in category &&
    category.translations &&
    typeof category.translations === 'object'
  ) {
    // @ts-ignore
    return category.translations[lang]?.name || category.translations.en?.name || 'Uncategorized';
  }
  if (typeof category === 'string') {
    return category;
  }
  return 'Uncategorized';
}

export const RecentPosts = ({ posts, lang }: RecentPostsProps) => {
  const validPosts = posts.filter((post) => isValidPost(post, lang)).slice(0, 4);
  if (validPosts.length === 0) return null;

  return (
    <section className='recent-posts'>
      <div className='recent-posts__container'>
        <div className='recent-posts__intro recent-posts__intro--area'>
          <h2 className='recent-posts__title'>
            Human Tech em Foco: As Últimas Reflexões e Insights!
          </h2>
          <p className='recent-posts__desc'>
            Mergulhe nas intersecções entre o universo digital e a experiência humana. Aqui, você
            encontra os quatro posts mais recentes, com insights sobre gestão de projetos, frontend,
            UI/UX, Scrum, e como a tecnologia molda a nossa vida.
          </p>
        </div>
        <div className='recent-posts__posts recent-posts__posts--area'>
          {validPosts.map((post, idx) => {
            const cat = post.categories?.[0];
            const logoSrc = getCategoryLogo(cat);
            const categoryName = getCategoryName(cat, lang);
            const translation = post.translations[lang] || post.translations.en || {};
            const title = translation.title || 'No title';
            const desc = translation.description || '';
            const displayDesc = desc.length > 120 ? desc.slice(0, 120) + '...' : desc;

            // Grid area para cada card
            const gridAreaClass = `recent-posts__card recent-posts__card--area${idx + 1}`;

            return (
              <div className={gridAreaClass} key={post._id}>
                <div>
                  <div className='recent-posts__card-logo'>
                    <img
                      src={logoSrc}
                      alt={categoryName}
                      className='recent-posts__card-logo-img'
                      loading='lazy'
                    />
                  </div>
                  <div className='recent-posts__card-content'>
                    <span className='recent-posts__card-category'>{categoryName}</span>
                    <h3 className='recent-posts__card-title'>{title}</h3>
                    <p className='recent-posts__card-desc'>{displayDesc}</p>
                  </div>
                </div>
                <div>
                  <Link
                    to={`/${lang}/posts/${post.slug}`}
                    className='recent-posts__card-link'
                    aria-label={`Read more: ${title}`}>
                    Read More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
