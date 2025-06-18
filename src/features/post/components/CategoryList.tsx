import { useEffect, useState } from 'react';
import axios from '../../../shared/utils/axios';
import { Category } from '../../../shared/types/Category';
import { useTranslation } from 'react-i18next';
import { getCategoryName } from '../../../shared/utils/i18nHelpers';
import '../styles/CategoryList.scss';
import { Link } from 'react-router-dom';

export const CategoryList = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>('/categories');
        setCategories(res.data);
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
        <li key={cat._id}>
          <Link
            to={`/${i18n.language.split('-')[0]}/category/${cat.slug}`}
            className='category-list__item'>
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
