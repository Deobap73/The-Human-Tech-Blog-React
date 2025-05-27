// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';
import './styles/global.scss';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './shared/context/ThemeProvider';
import { AuthProvider } from './shared/context/AuthProvider';
import { SocketProvider } from './shared/context/SocketProvider';
import { RecaptchaProvider } from './shared/context/RecaptchaProvider';
import ToastProvider from './shared/components/ToastProvider';
import api from './shared/utils/axios';
import { getAccessToken } from './shared/utils/authTokenStorage';

const token = getAccessToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
