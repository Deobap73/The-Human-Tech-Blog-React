// src/routes/SitemapProxyRoutes.tsx

import { Navigate } from 'react-router-dom';

const SitemapProxyRoutes = () => {
  const redirectTo = (path: string) =>
    window.location.replace(`https://api.thehumantechblog.com/${path}`);

  const path = window.location.pathname.replace('/', '');
  redirectTo(path);

  return null;
};

export default SitemapProxyRoutes;
