// /src/shared/context/LoginModalContext.tsx

import { createContext, useState, useCallback } from 'react';

export interface LoginModalContextProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  openRegister: () => void;
  registerOpen: boolean;
  closeRegister: () => void;
}

export const LoginModalContext = createContext<LoginModalContextProps>({
  isOpen: false,
  open: () => {},
  close: () => {},
  openRegister: () => {},
  registerOpen: false,
  closeRegister: () => {},
});

export const LoginModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setRegisterOpen(false);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const openRegister = useCallback(() => {
    setRegisterOpen(true);
    setIsOpen(true);
  }, []);
  const closeRegister = useCallback(() => setRegisterOpen(false), []);

  return (
    <LoginModalContext.Provider
      value={{ isOpen, open, close, openRegister, registerOpen, closeRegister }}>
      {children}
    </LoginModalContext.Provider>
  );
};
