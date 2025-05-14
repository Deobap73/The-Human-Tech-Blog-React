// The-Human-Tech-Blog-React/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './shared/context/ThemeProvider';
import { AuthProvider } from './shared/context/AuthContext';
import { SocketProvider } from './shared/context/SocketProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
