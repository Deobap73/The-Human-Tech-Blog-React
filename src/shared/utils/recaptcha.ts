// src/shared/utils/recaptcha.ts

/**
 * Helper to get Google reCAPTCHA v3 token programmatically.
 * Useful for calling inside async actions (e.g., in form handlers).
 */
export const getRecaptchaToken = (siteKey: string, action = 'login'): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action }).then(resolve, reject);
        });
      };
      document.body.appendChild(script);
    } else {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(siteKey, { action }).then(resolve, reject);
      });
    }
  });
};
