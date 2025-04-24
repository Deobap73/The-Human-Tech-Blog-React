// The-Human-Tech-Blog-React/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.scss'; // Global SCSS styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
