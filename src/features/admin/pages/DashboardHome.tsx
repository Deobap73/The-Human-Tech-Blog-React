// The-Human-Tech-Blog-React/src/pages/AdminPage/dashboard/DashboardHome.tsx
import { useAuth } from '../../../shared/hooks/useAuth';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
};

export default DashboardHome;
