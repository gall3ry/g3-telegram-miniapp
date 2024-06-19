'use client';
import { useAuth, useAuthHydrated } from '@gall3ry/g3-miniapp-global-store';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { useIsConnectionRestored } from '@tonconnect/ui-react';

export const useIsAuthenticated = () => {
  const { accessToken } = useAuth();
  const isHydrated = useAuthHydrated();
  const isConnectionRestored = useIsConnectionRestored();
  const { isLoading: isUserLoading } = api.auth.getCurrentUser.useQuery();

  return {
    isAuthenticated: !!accessToken && isHydrated,
    isLoading: isUserLoading || !isHydrated || !isConnectionRestored,
  };
};

export const useUser = () => {
  const { isAuthenticated } = useIsAuthenticated();

  return api.auth.getCurrentUser.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    select: (data) => {
      return {
        ...data,
        tonProvider: data.Provider.find((p) => p.type === 'TON_WALLET'),
      };
    },
  });
};
