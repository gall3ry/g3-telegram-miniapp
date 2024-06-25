'use client';
import { useAuth, useAuthHydrated } from '@gall3ry/g3-miniapp-global-store';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { useMemo } from 'react';

export const useIsAuthenticated = () => {
  const { accessToken } = useAuth();
  const isHydrated = useAuthHydrated();

  return {
    isAuthenticated: !!accessToken && isHydrated,
    isLoading: !isHydrated,
  };
};

export const useUser = () => {
  const { isAuthenticated } = useIsAuthenticated();

  const result = api.auth.getCurrentUser.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const tonProvider = useMemo(() => {
    return result.data?.Provider.find((p) => p.type === 'TON_WALLET');
  }, [result]);

  return {
    ...result,
    tonProvider,
  };
};
