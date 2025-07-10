// src/shared/utils/recaptcha.ts

/**
 * Helper to get Google reCAPTCHA v3 token programmatically.
 * Assumes script is already loaded in index.html!
 */
export const getRecaptchaToken = (siteKey: string, action = 'login'): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA script not loaded!'));
      return;
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action }).then(resolve, reject);
    });
  });
};
