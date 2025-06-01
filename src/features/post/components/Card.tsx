import '../styles/RecentPosts.scss';
import { Post } from '../../../shared/types/Post';
import { Category } from '../../../shared/types/Category';
import { isValidPost } from '../../../shared/utils/validation';
import { getPostTranslation, getCategoryName } from '../../../shared/utils/i18nHelpers';
import { Link } from 'react-router-dom';

interface RecentPostsProps {
  posts: Post[];
  lang: string;
}

export const RecentPosts = ({ posts, lang }: RecentPostsProps) => {
  const validPosts = posts.filter((post) => isValidPost(post, lang)).slice(0, 4);

  if (validPosts.length === 0) return null;

  return (
    <section className='recentPosts__container'>
      <div className='recentPosts'>
        <div className='recentPosts__introduction lastPostIntroduction'>
          <h2 className='recentPosts__title'>
            Human Tech em Foco: As Últimas Reflexões e Insights!
          </h2>
          <p className='recentPosts__description'>
            Mergulhe nas intersecções entre o universo digital e a experiência humana. Aqui, você
            encontra os quatro posts mais recentes, com insights sobre gestão de projetos, frontend,
            UI/UX, Scrum, e como a tecnologia molda a nossa vida.
          </p>
        </div>
        <div className='recentPosts__grid lastPostPosts'>
          {validPosts.map((post, idx) => {
            const translation = getPostTranslation(post.translations, lang);
            // ----> Get first category object (if populated)
            let cat = null;
            if (Array.isArray(post.categories) && post.categories.length > 0) {
              if (typeof post.categories[0] === 'object' && 'logo' in post.categories[0]) {
                cat = post.categories[0];
              }
            }
            const logoSrc = cat?.logo ? cat.logo : '/default-logo.png';
            const alt = cat ? getCategoryName(cat as any, lang) : 'No category logo';

            const areaName = `lastPost${idx + 1}`;
            const displayDescription =
              translation.description && translation.description.length > 120
                ? translation.description.substring(0, 120) + '...'
                : translation.description || '';

            return (
              <div className={`recentPosts__card ${areaName}`} key={post._id}>
                <img
                  src={logoSrc}
                  alt={alt}
                  className='recentPosts__card-image recentPosts__card-categoryLogo'
                />
                <h3 className='recentPosts__card-title'>{translation.title || 'No title'}</h3>
                <p className='recentPosts__card-description'>{displayDescription}</p>
                <Link to={`/${lang}/posts/${post.slug}`} className='recentPosts__card-link'>
                  Read More
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
