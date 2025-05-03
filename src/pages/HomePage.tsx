// The-Human-Tech-Blog-React/src/pages/HomePage.tsx

import './HomePage.scss';
import { Layout } from '../components/layout/Layout';
import Navbar from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { AboutMe } from '../components/aboutMe/AboutMe';
import { RecentPosts } from '../components/recentPosts/RecentPosts';
/* import { CategoryList } from '../components/categoryList/CategoryList'; */
import { LastPost } from '../components/lastPost/LastPost';
import { Sponsors } from '../components/sponsors/Sponsors';
/* import { MenuPosts } from '../components/menuPosts/MenuPosts'; */
import { MyFavoritePost } from '../components/myFavoritePost/MyFavoritePost';
import { Post } from '../types/Post';

// mockpost de exemplo para fase de programação
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'The Human Side of Agile Development',
    excerpt:
      'Exploring how agile methodologies affect team dynamics and personal growth in tech environments.',
    image: '../../public/1.jpg',
    category: 'agile Projects',
    createdAt: new Date(),
    views: 1245,
    status: 'published',
    author: {
      name: 'John Doe',
    },
    tags: ['agile', 'teamwork', 'tech'],
  },
  {
    id: 2,
    title: 'UX Design: Bridging Humans and Technology',
    excerpt:
      'How user experience design creates meaningful connections between people and digital products.',
    image: '../../public/2.jpg',
    category: 'frontend Ux',
    createdAt: new Date(),
    views: 980,
    status: 'published',
    author: {
      name: 'Jane Smith',
    },
    tags: ['ux', 'design', 'frontend'],
  },
  {
    id: 3,
    title: 'Navigating a Career in Tech',
    excerpt:
      'Personal reflections on building a meaningful career in the fast-paced tech industry.',
    image: '../../public/3.jpg',
    category: 'teck Career',
    createdAt: new Date(),
    views: 1560,
    status: 'published',
    author: {
      name: 'Alex Johnson',
    },
  },
  {
    id: 4,
    title: 'Essential Tools for Modern Developers',
    excerpt:
      'A curated list of tools that enhance productivity and creativity in software development.',
    image: '../../public/4.jpg',
    category: 'teck Tools',
    createdAt: new Date(),
    views: 2100,
    status: 'published',
    author: {
      name: 'Maria Garcia',
    },
    tags: ['tools', 'development', 'productivity'],
  },
  {
    id: 5,
    title: 'Why I Write About Technology',
    excerpt: 'Personal reflections on the importance of sharing knowledge and experiences in tech.',
    image: '../../public/5.jpg',
    category: 'personal Reflections',
    createdAt: new Date(),
    views: 870,
    status: 'published',
    author: {
      name: 'David Wilson',
    },
  },
  // Exemplo de post como rascunho
  {
    id: 6,
    title: 'Upcoming Article on AI Ethics',
    excerpt:
      'A preview of my thoughts on ethical considerations in artificial intelligence (work in progress).',
    image: '../../public/6.jpg',
    category: 'personal Reflections',
    createdAt: new Date(),
    views: 0,
    status: 'draft',
    author: {
      name: 'John Doe',
    },
  },
  // Exemplo de post arquivado
  {
    id: 7,
    title: 'Old Programming Techniques',
    excerpt: 'Looking back at programming approaches from the early 2000s.',
    image: '../../public/8.jpg',
    category: 'teck Career',
    createdAt: new Date(2020, 0, 1),
    views: 320,
    status: 'archived',
    author: {
      name: 'Jane Smith',
    },
  },
];

export const HomePage = () => {
  // Filtrar apenas posts publicados para exibição na página inicial exemplos para fase de programação
  const publishedPosts = mockPosts.filter((post) => post.status === 'published');

  return (
    <Layout>
      <Navbar />
      <div className='homeContainer'>
        <AboutMe />

        <RecentPosts posts={publishedPosts.slice(0, 4)} />

        {/* <CategoryList /> */}

        <LastPost post={publishedPosts[0]} />

        <Sponsors />

        {/*     <MenuPosts
          title='Most Popular Posts'
          posts={publishedPosts
            .slice()
            .sort((a, b) => b.views - a.views)
            .slice(0, 3)}
        /> */}

        <MyFavoritePost post={publishedPosts[3]} />
      </div>

      <Footer />
    </Layout>
  );
};
