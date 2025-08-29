// src/types/gtag.d.ts
export {};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: any[]) => void;
  }
}
