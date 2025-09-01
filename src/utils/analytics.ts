// src/utils/analytics.ts

export const GA_TRACKING_ID = 'G-GM3BY58JC8';

const isProd = import.meta.env.PROD === true;
const isGAReady = () =>
  typeof window !== 'undefined' &&
  typeof window.gtag === 'function' &&
  !!GA_TRACKING_ID &&
  GA_TRACKING_ID.startsWith('G-');

// Dispara o primeiro config no load inicial da app
export const initGA = () => {
  if (!isProd || !isGAReady()) return;
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_path: window.location.pathname + window.location.search,
    // podes activar isto em debug local:
    // debug_mode: true,
  });
  if (import.meta.env.DEV) console.log('[GA4] init config sent');
};

// Envia pageview em mudanças de rota (SPA)
export const pageview = (url: string) => {
  if (!isProd || !isGAReady()) return;
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
  if (import.meta.env.DEV) console.log('[GA4] page_view =>', url);
};

// Eventos customizados
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (!isProd || !isGAReady()) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
  if (import.meta.env.DEV) console.log('[GA4] event =>', action, { category, label, value });
};
