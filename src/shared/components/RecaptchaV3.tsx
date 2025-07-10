// src/shared/components/RecaptchaV3.tsx
import { useEffect } from 'react';
import './styles/RecaptchaV3.scss';

type RecaptchaV3Props = {
  siteKey: string;
  action: string;
  onToken: (token: string) => void;
};

declare global {
  interface Window {
    grecaptcha: any;
  }
}

/**
 * RecaptchaV3 component loads Google reCAPTCHA v3 and executes an action,
 * returning the generated token via the onToken callback.
 * Usage: <RecaptchaV3 siteKey="..." action="login" onToken={handleToken} />
 */
const RecaptchaV3: React.FC<RecaptchaV3Props> = ({ siteKey, action, onToken }) => {
  useEffect(() => {
    const injectScript = () => {
      if (document.getElementById('recaptcha-v3-script')) return;
      const script = document.createElement('script');
      script.id = 'recaptcha-v3-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      document.body.appendChild(script);
    };

    injectScript();

    const executeRecaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action }).then((token: string) => {
            onToken(token);
          });
        });
      }
    };

    const interval = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.execute) {
        clearInterval(interval);
        executeRecaptcha();
      }
    }, 300);

    return () => clearInterval(interval);
  }, [siteKey, action, onToken]);

  return null; // Invisible
};

export default RecaptchaV3;
