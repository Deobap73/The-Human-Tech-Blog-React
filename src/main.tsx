// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
// Internationalization setup
import './i18n';
// Import global SCSS (must be first for variables and resets)
import './styles/global.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './shared/context/ThemeProvider';
import { AuthProvider } from './shared/context/AuthProvider';
import { SocketProvider } from './shared/context/SocketProvider';
import { RecaptchaProvider } from './shared/context/RecaptchaProvider';
import ToastProvider from './shared/components/ToastProvider';
import api from './shared/utils/axios';
import { getAccessToken } from './shared/utils/authTokenStorage';
import { LoginModalProvider } from './shared/context/LoginModalContext'; // ADICIONADO

// Set up axios with access token if available
const token = getAccessToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <LoginModalProvider>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <SocketProvider>
                <RecaptchaProvider>
                  <ToastProvider>
                    <App />
                  </ToastProvider>
                </RecaptchaProvider>
              </SocketProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </LoginModalProvider>
    </HelmetProvider>
  </React.StrictMode>
);
