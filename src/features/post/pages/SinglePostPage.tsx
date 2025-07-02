// /src/features/post/pages/SinglePostPage.tsx

import '../styles/CodeBlock.scss'; // Include code block styles
import hljs from 'highlight.js'; // import highlight.js
import 'highlight.js/styles/github-dark.css'; // add desired theme
import '../styles/SinglePostPage.scss';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../shared/utils/axios';
import { Post, PostTranslation } from '../../../shared/types/Post';
import { getAvatar } from '../../../shared/utils/getAvatar';
import { BookmarkButton } from '../components/BookmarkButton';
import Comments from '../components/Comments';
import { ReactionButtons } from '../components/ReactionButtons';
import { getPostTranslation, getCategoryName, getTagName } from '../../../shared/utils/i18nHelpers';
import RecentCategoryPosts from '../components/RecentCategoryPosts';
import CategoryList from '../components/CategoryList';
import ScrollToTop from '../../../shared/components/ScrollToTop';

type PostUser = {
  _id?: string;
  name?: string;
  avatar?: string;
};

function getTagLabel(tag: any, lang: string) {
  if (tag.translations && tag.translations[lang]?.name) return tag.translations[lang].name;
  if (tag.translations && tag.translations.en?.name) return tag.translations.en.name;
  return tag.name || 'Tag';
}

export const SinglePostPage = () => {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/slug/${slug}`);
        const translation = getPostTranslation(res.data.translations, i18n.language);
        const postIsValid =
          res.data.status === 'published' &&
          translation.title &&
          translation.title.trim().length > 0;
        setPost(postIsValid ? res.data : null);
        setError(!postIsValid);
      } catch {
        setError(true);
      }
    };
    fetchPost();
  }, [slug, i18n.language]);

  useEffect(() => {
    // ✅ Highlight code blocks after post content is rendered
    hljs.highlightAll();
  }, [post]);

  if (error) {
    return (
      <>
        <ScrollToTop />
        <div className='single-post-page single-post-page--error'>
          <h2 className='single-post-page__error-title'>
            {t('postNotFound', 'Post not found or unpublished')}
          </h2>
          <Link to='/' className='single-post-page__back-link'>
            <button className='single-post-page__back-button'>{t('backToHome')}</button>
          </Link>
        </div>
      </>
    );
  }

  if (!post) return <div className='single-post-page__loading'>Loading...</div>;

  const translation: PostTranslation = post.translations
    ? getPostTranslation(post.translations, i18n.language)
    : { title: '', description: '', content: '' };

  const category =
    post.categories && post.categories.length > 0 && typeof post.categories[0] === 'object'
      ? getCategoryName(post.categories[0] as any, i18n.language)
      : '';

  const user: PostUser = (post as any).user || (post as any).author || {};

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <>
      <ScrollToTop />
      <div className='single-post-page'>
        <section className='single-post-page__header-row'>
          <div className='single-post-page__header-info'>
            <h1 className='single-post-page__title'>{translation.title}</h1>
            <div className='single-post-page__meta'>
              <img
                src={getAvatar(user || undefined)}
                alt='User avatar'
                className='single-post-page__avatar'
                width={48}
                height={48}
              />
              <div>
                <div className='single-post-page__username'>{user.name || 'User'}</div>
                <div className='single-post-page__date'>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                </div>
              </div>
            </div>
            <BookmarkButton postId={post._id} className='single-post-page__bookmark-button' />
          </div>
          <div className='single-post-page__header-image'>
            {post.image && (
              <img src={post.image} alt={translation.title} className='single-post-page__image' />
            )}
          </div>
        </section>

        <div className='single-post-page__body-row'>
          <main className='single-post-page__main' aria-label={translation.title}>
            <div className='single-post-page__category-bar'>
              <span className='single-post-page__category'>{category}</span>
            </div>

            {tags.length > 0 && (
              <div className='single-post-page__tags' aria-label={t('tags', 'Tags')}>
                {tags.map((tag: any) => (
                  <Link
                    to={`/${i18n.language}/tags/${tag.slug}`}
                    className='single-post-page__tag'
                    key={tag._id}>
                    #{getTagLabel(tag, i18n.language)}
                  </Link>
                ))}
              </div>
            )}

            <div
              className='single-post-page__description'
              dangerouslySetInnerHTML={{ __html: translation.content || '' }}
            />

            <div className='single-post-page__reactions'>
              <ReactionButtons postId={post._id} />
            </div>

            <section className='single-post-page__comments-section'>
              <h3 className='single-post-page__comments-title'>
                {t('postPage.comments', 'Comments')}
              </h3>
              <Comments postId={post._id} className='single-post-page__comments-list' />
            </section>
          </main>

          <aside className='single-post-page__sidebar' aria-label='Sidebar'>
            <section className='single-post-page__sidebar-block'>
              <RecentCategoryPosts currentPostId={post._id} lang={i18n.language} />
            </section>
            <section className='single-post-page__sidebar-block'>
              <CategoryList />
            </section>
          </aside>
        </div>

        <div className='single-post-page__footer'>
          <Link to='/' className='single-post-page__back-link'>
            {t('postPage.backToHome')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default SinglePostPage;
