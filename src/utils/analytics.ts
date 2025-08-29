// src/utils/analytics.ts
export const GA_TRACKING_ID = 'G-GM3BY58JC8';

const isProd = import.meta.env.PROD === true; // evita ruído em dev
const isGAReady = () =>
  typeof window !== 'undefined' && typeof window.gtag === 'function' && isProd;

// Regista uma page view
export const pageview = (url: string) => {
  if (!isGAReady()) return;
  window.gtag('config', GA_TRACKING_ID, { page_path: url });
};

// Regista um evento customizado
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
  if (!isGAReady()) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
