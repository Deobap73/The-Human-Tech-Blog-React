// The-Human-Tech-Blog-React/src/components/lastPost/LastPost.tsx

import '../styles/LastPost.scss';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/Post';
import { isValidPost } from '../../../shared/utils/validation';
import { useTranslation } from 'react-i18next';

interface LastPostProps {
  post?: Post;
  lang?: string;
}

export const LastPost = ({ post, lang }: LastPostProps) => {
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language.split('-')[0] || 'en';

  if (!post || !isValidPost(post)) return null;

  // Extrai tradução segura
  const translation = post.translations[currentLang] ||
    Object.values(post.translations).find(Boolean) || { title: '', description: '', content: '' };

  // Supondo que categories é string[] com slug ou nome, só mostramos o slug/nome.
  // Se for array de objetos, ajusta aqui!
  const firstCategory = post.categories?.[0] || 'Uncategorized';
  // Exemplo: se tiveres um mapeamento de slugs para nomes/logos, podes buscar aqui!

  return (
    <div className='lastPost'>
      <h2 className='title'>Latest Post</h2>
      <div className='content'>
        <img
          src={post.image || '/default-image.jpg'}
          alt={translation.title}
          className='postImage'
        />
        <div className='details'>
          <div className='category'>
            {/* Se tiveres um logo associado a cada categoria, faz o mapping aqui! */}
            {/* Exemplo estático, ajusta conforme a tua lógica de categorias: */}
            {/* <img src={`/images/${categoryLogoMapping[firstCategory]}`} alt={firstCategory} className='categoryLogo' /> */}
            <span className='categoryName'>{firstCategory}</span>
          </div>
          <h3 className='postTitle'>{translation.title}</h3>
          <p className='excerpt'>{translation.description}</p>
          <Link to={`/posts/${post.slug}`}>
            <button className='cardPost__descriptionContainer__textContainer__readMore'>
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
