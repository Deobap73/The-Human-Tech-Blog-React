// /src/shared/hooks/useLoginModal.ts

import { useContext } from 'react';
import { LoginModalContext } from '../context/LoginModalContext';

export const useLoginModal = () => useContext(LoginModalContext);
