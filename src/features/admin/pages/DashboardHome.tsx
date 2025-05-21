// ✅ The-Human-Tech-Blog-React/src/features/admin/pages/DashboardHome.tsx
import { useEffect, useState } from 'react';
import api from '../../../shared/utils/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLogTable from '../components/AdminLogTable';
import '../styles/DashboardHome.scss';

const DashboardHome = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const chartData = [
    { name: 'Users', count: stats.totalUsers },
    { name: 'Posts', count: stats.totalPosts },
    { name: 'Drafts', count: stats.totalDrafts },
    { name: 'Comments', count: stats.totalComments },
  ];

  return (
    <div className='dashboard-home'>
      <h2>📊 Admin Dashboard</h2>

      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={chartData} margin={{ top: 30, left: 10, right: 10, bottom: 5 }}>
          <XAxis dataKey='name' />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey='count' fill='#007bff' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <AdminLogTable />
    </div>
  );
};

export default DashboardHome;
