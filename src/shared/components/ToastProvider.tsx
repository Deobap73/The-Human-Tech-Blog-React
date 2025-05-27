// src/shared/components/ToastProvider.tsx
import { Toaster } from 'react-hot-toast';

const ToastProvider = ({ children }: { children: React.ReactNode }) => (
  <>
    <Toaster
      position='top-right'
      toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
          fontSize: '1rem',
          borderRadius: '8px',
          boxShadow: '0 3px 12px #0011a330',
        },
        success: {
          style: { background: '#e8f5e9', color: '#207c4b' },
        },
        error: {
          style: { background: '#ffebee', color: '#b71c1c' },
        },
      }}
      containerStyle={{ zIndex: 99999 }}
      gutter={10}
    />
    {children}
  </>
);

export default ToastProvider;
