// /src/features/post/components/CategoryList.tsx

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../../../shared/utils/axios';
import { Category } from '../../../shared/types/Category';
import { useTranslation } from 'react-i18next';
import { getCategoryName } from '../../../shared/utils/i18nHelpers';
import '../styles/CategoryList.scss';

export const CategoryList = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  // Grab the language param for proper route formatting
  const params = useParams();
  const lang = params.lang || i18n.language.split('-')[0] || 'en';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>('/categories');
        setCategories(res.data);
      } catch (err) {
        // Handle error (optionally show a toast)
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className='category-list__loading'>Loading categories...</div>;

  return (
    <ul className='category-list'>
      {categories.map((cat) => (
        <li className='category-list__item' key={cat._id}>
          <Link
            to={`/${lang}/categories/${cat.slug}`}
            className='category-list__link'
            // Optionally, add aria-label for accessibility
            aria-label={`See posts in category ${getCategoryName(cat, i18n.language)}`}>
            {cat.logo && (
              <img
                className='category-list__logo'
                src={cat.logo}
                alt={getCategoryName(cat, i18n.language)}
                loading='lazy'
              />
            )}
            <span className='category-list__name'>{getCategoryName(cat, i18n.language)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
