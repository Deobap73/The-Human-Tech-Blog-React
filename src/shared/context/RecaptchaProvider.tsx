// src/shared/context/RecaptchaProvider.tsx

import { createContext, useContext, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

interface RecaptchaContextType {
  execute: () => Promise<string | null>;
  reset: () => void;
}

const RecaptchaContext = createContext<RecaptchaContextType | undefined>(undefined);

export const RecaptchaProvider = ({ children }: { children: React.ReactNode }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const execute = async () => {
    if (!recaptchaRef.current) return null;
    return await recaptchaRef.current.executeAsync();
  };

  const reset = () => {
    recaptchaRef.current?.reset();
  };

  return (
    <RecaptchaContext.Provider value={{ execute, reset }}>
      {children}
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        size='invisible'
        badge='bottomright'
        theme='light'
      />
    </RecaptchaContext.Provider>
  );
};

export const useRecaptcha = () => {
  const context = useContext(RecaptchaContext);
  if (!context) throw new Error('useRecaptcha must be used within <RecaptchaProvider>');
  return context;
};
