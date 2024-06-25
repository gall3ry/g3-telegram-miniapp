'use client';
import { useAuth } from '@gall3ry/g3-miniapp-global-store';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { retrieveLaunchParams } from '@tma.js/sdk-react';
import { useEffect } from 'react';

export const BackendAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setAccessToken } = useAuth();
  api.auth.updateDisplayName.useMutation();
  const { mutateAsync: signIn } = api.auth.signIn.useMutation();

  // Login with telegram
  useEffect(() => {
    const { initDataRaw } = retrieveLaunchParams();
    if (initDataRaw) {
      signIn(
        {
          type: 'TELEGRAM',
          dataCheckString: initDataRaw,
        },
        {
          onSuccess: ({ token }) => {
            setAccessToken(token);
          },
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset session
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     reset();

  //     if (tonConnectUI.connected) void tonConnectUI.disconnect();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated, isLoading]);

  return children;
};
