// /src/utils/registerServiceWorker.ts
/* eslint-disable @typescript-eslint/no-floating-promises */
/**
 * Registers /public/sw.js with a scope derived from Vite's BASE_URL.
 * This guarantees correct scope when the app is deployed under a sub-path.
 */

export function registerServiceWorker(): void {
  // Service workers require HTTPS (or localhost).
  const isSecure =
    window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  if (!('serviceWorker' in navigator) || !isSecure) {
    if (import.meta.env.DEV) {
      console.debug('[SW] Service worker not registered (insecure context or unsupported).');
    }
    return;
  }

  // Vite injects BASE_URL at build time. Example: "/" or "/pvt/".
  const base = import.meta.env.BASE_URL || '/';
  const swUrl = `${base}sw.js`;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl, { scope: base })
      .then((reg) => {
        if (import.meta.env.DEV) {
          console.debug('[SW] Registered:', reg.scope);
        }
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
  });
}
