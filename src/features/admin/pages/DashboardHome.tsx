// The-Human-Tech-Blog-React/src/features/admin/pages/DashboardHome.tsx

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
import '../styles/DashboardHome.scss';

const COLORS = ['#457b9d', '#a8dadc', '#f1faee', '#e63946', '#2d3142'];

const DashboardHome = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api
      .get('/analytics/kpis')
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);

  if (!data) return <p className='dashboard-home__loading'>Loading dashboard...</p>;

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

  return (
    <div className='dashboard-home'>
      <h2 className='dashboard-home__title'>📊 Admin Dashboard</h2>

      {/* KPIs */}
      <div className='dashboard-home__kpis'>{/* ...como antes */}</div>

      {/* Gráfico de barras principais */}
      <ResponsiveContainer width='100%' height={220}>
        <BarChart data={chartData} margin={{ top: 10, left: 10, right: 10, bottom: 5 }}>
          <XAxis dataKey='name' />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey='count' fill='#457b9d' radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className='dashboard-home__charts-row'>
        {/* Gráfico de posts por semana */}
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
        {/* Gráfico de registos de utilizadores por semana */}
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
        {/* Gráfico de pizza: posts por categoria */}
        <div className='dashboard-home__chart'>
          <h4 className='dashboard-home__chart-title'>Distribuição Posts/Categoria</h4>
          <ResponsiveContainer width='100%' height={180}>
            <PieChart>
              <Pie
                data={data.postsPerCategory}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={60}
                label>
                {data.postsPerCategory.map((entry: any, idx: number) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top users ativos */}
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

      {/* Categorias principais */}
      <div className='dashboard-home__top-categories'>
        <h3>Top Categories</h3>
        <ul>
          {data.topCategories.map((cat: any) => (
            <li key={cat.slug} className='dashboard-home__category-item'>
              {cat.logo && (
                <img
                  src={resolveLogoUrl(cat.logo)}
                  alt={cat.name}
                  className='dashboard-home__category-logo'
                  height={22}
                  width={22}
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
