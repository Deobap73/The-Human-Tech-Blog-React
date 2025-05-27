// src/shared/hooks/useToast.ts
import toast, { ToastOptions } from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (msg: string, opts?: ToastOptions) => toast.success(msg, opts),
    error: (msg: string, opts?: ToastOptions) => toast.error(msg, opts),
    info: (msg: string, opts?: ToastOptions) => toast(msg, opts),
    dismiss: () => toast.dismiss(),
  };
};
