// The-Human-Tech-Blog-React/src/components/categoryList/CategoryList.tsx

import "../styles/CategoryList.scss";

const categories = [
  { name: 'Agile Projects', color: 'var(--category-agileProjects)' },
  { name: 'Frontend UX', color: 'var(--category-frontendUx)' },
  { name: 'Tech Career', color: 'var(--category-teckCareer)' },
  { name: 'Tech Tools', color: 'var(--category-teckTools)' },
  { name: 'Reflections', color: 'var(--category-personalReflections)' },
];

export const CategoryList = () => {
  return (
    <ul className='category-list'>
      {categories.map((cat) => (
        <li key={cat.name} className='category-list__item' style={{ backgroundColor: cat.color }}>
          {cat.name}
        </li>
      ))}
    </ul>
  );
};
