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
 * RecaptchaV3 component for Google reCAPTCHA v3.
 * Assumes the script is pre-loaded in index.html.
 */
const RecaptchaV3: React.FC<RecaptchaV3Props> = ({ siteKey, action, onToken }) => {
  useEffect(() => {
    if (!window.grecaptcha) return; // Script ainda não carregou, pode dar throw se chamar cedo demais.
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action }).then((token: string) => {
        onToken(token);
      });
    });
  }, [siteKey, action, onToken]);

  return null; // Invisible
};

export default RecaptchaV3;
