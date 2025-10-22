// /src/features/admin/components/Sidebar.tsx
'use strict';

import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import '../styles/Sidebar.scss';
import { useAuth } from '../../../shared/hooks/useAuth';
import api from '../../../shared/utils/axios';
import { useTranslation } from 'react-i18next';

/**
 * buildAdminUrl
 * - Builds a localized admin URL: `/:lang/admin/...`
 * - Accepts a relative path (with or without leading slash).
 */
const buildAdminUrl = (path: string, lang: string) => {
  const normalized = typeof path === 'string' && path.startsWith('/') ? path.slice(1) : path;
  return `/${lang}/admin${normalized ? '/' + normalized : ''}`;
};

const Sidebar = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const activeLang = lang || i18n.language.split('-')[0] || 'en';

  // Load pending moderation count for admins/editors
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'editor')) {
      api
        .get('/comments/moderation/count')
        .then((res) => setPendingCount(res.data.count || 0))
        .catch(() => setPendingCount(0));
    }
  }, [user]);

  return (
    <aside className='admin-sidebar'>
      <nav className='admin-sidebar-Navbar' aria-label='Admin navigation'>
        {/* Dashboard */}
        <NavLink to={buildAdminUrl('', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.dashboard')}
        </NavLink>

        {/* Posts */}
        <NavLink to={buildAdminUrl('posts', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.posts')}
        </NavLink>

        {/* Drafts */}
        <NavLink to={buildAdminUrl('drafts', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.drafts', 'Drafts')}
        </NavLink>

        {/* Tags */}
        <NavLink to={buildAdminUrl('tags', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.tags', 'Manage Tags')}
        </NavLink>

        {/* Categories */}
        <NavLink to={buildAdminUrl('categories', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.categories', 'Manage Categories')}
        </NavLink>

        {/* Messages / Chat */}
        <NavLink to={buildAdminUrl('messages', activeLang)} className='admin-sidebar-Navbar-link'>
          {t('admin.messages')}
        </NavLink>

        {/* Moderate Comments (admin/editor) */}
        {user && (user.role === 'admin' || user.role === 'editor') && (
          <NavLink
            to={buildAdminUrl('comments/moderate', activeLang)}
            className='admin-sidebar-Navbar-link'>
            {t('admin.moderateComments')}
            {pendingCount > 0 && <span className='sidebar-badge'>{pendingCount}</span>}
          </NavLink>
        )}

        {/* Projects (admin only) */}
        {user && user.role === 'admin' && (
          <NavLink to={buildAdminUrl('projects', activeLang)} className='admin-sidebar-Navbar-link'>
            {/* Falls back to "Projects" if the i18n key is not present */}
            {t('admin.projects.title', 'Projects')}
          </NavLink>
        )}

        {/* Settings (admin only) */}
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
