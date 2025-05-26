// /src/features/admin/components/Sidebar.tsx

import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import '../styles/Sidebar.scss';
import { useAuth } from '../../../shared/hooks/useAuth';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';

/**
 * Helper to build multilanguage-aware URLs for admin sidebar.
 */
const buildAdminUrl = (path: string, lang: string) => {
  // Remove any leading slash from path
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `/${lang}/admin${normalized ? '/' + normalized : ''}`;
};

const Sidebar = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  // Fallback to i18n language if lang param not present
  const activeLang = lang || i18n.language.split('-')[0] || 'en';

  useEffect(() => {
    // Só busca se for admin ou editor
    if (user && (user.role === 'admin' || user.role === 'editor')) {
      api
        .get('/comments/moderation/count')
        .then((res) => setPendingCount(res.data.count || 0))
        .catch(() => setPendingCount(0));
    }
  }, [user]);

  return (
    <aside className='admin-sidebar'>
      <nav className='admin-sidebar-Navbar'>
        <NavLink to={buildAdminUrl('', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.dashboard')}
        </NavLink>
        <NavLink to={buildAdminUrl('posts', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.posts')}
        </NavLink>
        <NavLink to={buildAdminUrl('messages', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.messages')}
        </NavLink>
        {user && (user.role === 'admin' || user.role === 'editor') && (
          <NavLink
            to={buildAdminUrl('comments/moderate', activeLang)}
            className='admin-sidebar-Navbar-link'>
            {t('admin.moderateComments')}
            {pendingCount > 0 && <span className='sidebar-badge'>{pendingCount}</span>}
          </NavLink>
        )}
        {user && user.role === 'admin' && (
          <NavLink to={buildAdminUrl('settings', activeLang)} className='admin-sidebar-Navbar-link'>
            {t('admin.settings')}
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
