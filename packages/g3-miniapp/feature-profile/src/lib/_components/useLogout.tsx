'use client';

import { useAuth } from '@gall3ry/g3-miniapp-global-store';

export const useLogout = () => {
  const { reset } = useAuth();

  return {
    logout: reset,
  };
};
