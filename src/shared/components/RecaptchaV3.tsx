// /src/shared/components/RecaptchaV3.tsx

import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface RecaptchaV3Props {
  siteKey: string;
  action: string;
  onToken: (token: string) => void;
}

/**
 * Google reCAPTCHA v3 integration (headless).
 * Calls onToken with generated token.
 */
export const RecaptchaV3 = ({ siteKey, action, onToken }: RecaptchaV3Props) => {
  useEffect(() => {
    const loadAndRun = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action }).then(onToken);
        });
      }
    };

    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = loadAndRun;
      document.body.appendChild(script);
    } else {
      loadAndRun();
    }
  }, [siteKey, action, onToken]);

  return null;
};
