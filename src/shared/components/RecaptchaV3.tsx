// src/shared/components/RecaptchaV3.tsx

import { useEffect } from 'react';

interface RecaptchaV3Props {
  siteKey: string;
  action: string;
  onToken: (token: string) => void;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

/**
 * Invisible Google reCAPTCHA v3 component.
 * Calls onToken(token) when complete.
 */
export const RecaptchaV3: React.FC<RecaptchaV3Props> = ({ siteKey, action, onToken }) => {
  useEffect(() => {
    // Load reCAPTCHA script if not present
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action }).then(onToken);
        });
      };
      document.body.appendChild(script);
    } else {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(siteKey, { action }).then(onToken);
      });
    }
  }, [siteKey, action, onToken]);

  return null; // No UI rendered
};
