'use client';
import { useAuth } from '@gall3ry/g3-miniapp-global-store';
import { useIsConnectionRestored } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import { api } from '../../trpc/react';

export { useAuth } from '@gall3ry/g3-miniapp-global-store';

export const useAuthHydrated = () => {
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useAuth.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = useAuth.persist.onFinishHydration(() =>
      setHydrated(true)
    );

    setHydrated(useAuth.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return isHydrated;
};

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
