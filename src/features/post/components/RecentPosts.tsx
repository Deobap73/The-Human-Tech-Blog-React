// /src/features/post/components/RecentPosts.tsx

import '../styles/RecentPosts.scss';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { getCategoryName } from '../../../shared/utils/i18nHelpers';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';
import { isValidPost } from '../../../shared/utils/validation';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface RecentPostsProps {
  posts: Post[];
  lang: string;
}

/**
 * Safely get the logo URL from a category object, fallback to default if needed.
 */
function getCategoryLogo(category: string | Category | undefined): string {
  if (
    category &&
    typeof category === 'object' &&
    'logo' in category &&
    typeof category.logo === 'string' &&
    category.logo
  ) {
    return resolveLogoUrl(category.logo);
  }
  return '/default-logo.png';
}

export const RecentPosts = ({ posts, lang }: RecentPostsProps) => {
  const { t, i18n } = useTranslation();
  const validPosts = posts
    .filter((post) => isValidPost(post, lang) && !post.isQuickPost)
    .slice(0, 4);
  if (validPosts.length === 0) return null;

  return (
    <section className='recent-posts'>
      <div className='recent-posts__container'>
        <div className='recent-posts__intro recent-posts__intro--area'>
          <h2 className='recent-posts__title'>{t('recentPosts.title')}</h2>
          <p className='recent-posts__desc'>{t('recentPosts.desc')}</p>
        </div>
        <div className='recent-posts__posts recent-posts__posts--area'>
          {validPosts.map((post, idx) => {
            const cat = post.categories?.[0];
            const logoSrc = getCategoryLogo(cat);
            const categoryName = getCategoryName(cat, lang);
            const translation = post.translations[lang] || post.translations.en || {};
            const title = translation.title || t('recentPosts.noTitle');
            const desc = translation.description || '';
            const displayDesc = desc.length > 120 ? desc.slice(0, 120) + '...' : desc;

            // Assign a specific grid area for each card, for custom layouts
            const gridAreaClass = `recent-posts__card recent-posts__card--area${idx + 1}`;

            return (
              <div className={gridAreaClass} key={post._id}>
                <div>
                  <div className='recent-posts__card-logo'>
                    <img
                      className='recent-posts__card-logo-img'
                      src={logoSrc}
                      alt={categoryName}
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
                    aria-label={`${t('recentPosts.readMore')}: ${title}`}>
                    {t('recentPosts.readMore')}
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

export default RecentPosts;
