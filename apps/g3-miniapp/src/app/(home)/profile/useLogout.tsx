'use client';
import { useAuth } from '../../_providers/useAuth';

export const useLogout = () => {
  const { reset } = useAuth();

  return {
    logout: reset,
  };
};
