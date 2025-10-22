// /src/features/admin/pages/DashboardHome.tsx

import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import AdminLogTable from '../components/AdminLogTable';
import NewsletterSubscribersTable from '../components/NewsletterSubscribersTable';
import { resolveLogoUrl } from '../../../shared/utils/mediaHelpers';
import { getCategoryName } from '../../../shared/utils/i18nHelpers';
import { useTranslation } from 'react-i18next';
import '../styles/DashboardHome.scss';
import { Category } from '../../../shared/types/Category';

const COLORS = ['#457b9d', '#a8dadc', '#f1faee', '#e63946', '#2d3142'];

const DashboardHome = () => {
  const [data, setData] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] || 'en';

  // Fetch main dashboard analytics
  useEffect(() => {
    api
      .get('/analytics/kpis')
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);

  // Fetch all categories for translation support
  useEffect(() => {
    api
      .get<Category[]>('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  if (!data || loadingCategories) {
    return <p className='dashboard-home__loading'>Loading dashboard...</p>;
  }

  // Find category object by slug (or fallback)
  const findCategoryBySlug = (slug: string) => categories.find((cat) => cat.slug === slug) || null;

  // KPIs
  const chartData = [
    { name: 'Users', count: data.totalUsers },
    { name: 'Posts', count: data.totalPosts },
    { name: 'Comments', count: data.totalComments },
    { name: 'Categories', count: data.totalCategories },
    { name: 'Pending Comments', count: data.commentsPending },
    { name: 'Posts Today', count: data.postsToday },
    { name: 'Users Today', count: data.usersToday },
  ];

  const postsWeekData = (data.postsWeek || []).map((count: number, i: number) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    posts: count,
  }));

  const usersWeekData = (data.usersWeek || []).map((count: number, i: number) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    users: count,
  }));

  // Pie data: add translations and logos to each entry
  const postsPerCategoryPie = (data.postsPerCategory || []).map((cat: any) => {
    const found = findCategoryBySlug(cat.slug);
    return {
      ...cat,
      name: found ? getCategoryName(found, lang) : cat.name,
      logo: found && found.logo ? resolveLogoUrl(found.logo) : undefined,
    };
  });

  // Top categories for list (with translated name and logo)
  const topCategories = (data.topCategories || []).map((cat: any) => {
    const found = findCategoryBySlug(cat.slug);
    return {
      ...cat,
      name: found ? getCategoryName(found, lang) : cat.name,
      logo: found && found.logo ? resolveLogoUrl(found.logo) : undefined,
    };
  });

  return (
    <div className='dashboard-home'>
      <h2 className='dashboard-home__title'>📊 Admin Dashboard</h2>

      {/* KPIs */}
      <div className='dashboard-home__kpis'>{/* ...as before... */}</div>

      {/* Main bar chart */}
      <ResponsiveContainer width='100%' height={220}>
        <BarChart data={chartData} margin={{ top: 10, left: 10, right: 10, bottom: 5 }}>
          <XAxis dataKey='name' />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey='count' fill='#457b9d' radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className='dashboard-home__charts-row'>
        {/* Posts per week */}
        <div className='dashboard-home__chart'>
          <h4 className='dashboard-home__chart-title'>Posts / Semana</h4>
          <ResponsiveContainer width='100%' height={160}>
            <LineChart data={postsWeekData}>
              <XAxis dataKey='day' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type='monotone' dataKey='posts' stroke='#1d3557' strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Users registered per week */}
        <div className='dashboard-home__chart'>
          <h4 className='dashboard-home__chart-title'>Utilizadores / Semana</h4>
          <ResponsiveContainer width='100%' height={160}>
            <LineChart data={usersWeekData}>
              <XAxis dataKey='day' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type='monotone' dataKey='users' stroke='#e63946' strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Pie chart: posts per category */}
        <div className='dashboard-home__chart'>
          <h4 className='dashboard-home__chart-title'>Distribuição Posts/Categoria</h4>
          <ResponsiveContainer width='100%' height={180}>
            <PieChart>
              <Pie
                data={postsPerCategoryPie}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={60}
                label={({ name }) => name}>
                {postsPerCategoryPie.map((_, idx: number) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top users by posts */}
      <div className='dashboard-home__top-users'>
        <h3>Top Users (Posts)</h3>
        <ul>
          {data.topUsers.map((user: any) => (
            <li key={user.name} className='dashboard-home__user-item'>
              <span className='dashboard-home__user-name'>{user.name}</span>
              <span className='dashboard-home__user-posts'>{user.posts} posts</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top categories with logo and translated name */}
      <div className='dashboard-home__top-categories'>
        <h3>Top Categories</h3>
        <ul>
          {topCategories.map((cat: any) => (
            <li key={cat.slug} className='dashboard-home__category-item'>
              {cat.logo && (
                <img
                  src={cat.logo}
                  alt={cat.name}
                  className='dashboard-home__category-logo'
                  height={22}
                  width={22}
                  loading='lazy'
                />
              )}
              <span className='dashboard-home__category-name'>{cat.name}</span>
              <span className='dashboard-home__category-count'>{cat.postsCount} posts</span>
            </li>
          ))}
        </ul>
      </div>

      <NewsletterSubscribersTable />
      <AdminLogTable />
    </div>
  );
};

export default DashboardHome;
