'use client';
import { useAuthHydrated } from '@gall3ry/g3-miniapp-global-store';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { useQuery } from '@tanstack/react-query';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';

export const useGeneratePayload = () => {
  return api.auth.generatePayload.useQuery(undefined, {
    enabled: false,
    staleTime: 1000 * 60,
  });
};

const payloadTTLMS = 1000 * 60 * 9; // 9 minutes

/**
 * Connect to TON provider
 *
 * Call this hook to listen to TON provider connection status and handle connection
 * @returns
 * @example
 * ```tsx
 * const { tonConnectUI } = useConnectTonProvider();
 * ```
 */
export const useOpenConnectTonProviderModal = () => {
  const isHydrated = useAuthHydrated();
  const { refetch: fetchPayload } = useGeneratePayload();
  const [, setShowDrawer] = useQueryState(
    'showDrawer',
    parseAsBoolean.withDefault(false)
  );
  const [tonConnectUI] = useTonConnectUI();

  useQuery({
    queryKey: [
      'custom',
      'recreateProofPayload',
      {
        isHydrated,
      },
    ],
    queryFn: async () => {
      tonConnectUI.setConnectRequestParameters({ state: 'loading' });
      const { data } = await fetchPayload();
      if (!data) {
        throw new Error('Payload is missing');
      }

      if (data) {
        tonConnectUI.setConnectRequestParameters({
          state: 'ready',
          value: {
            tonProof: data.tonProof,
          },
        });
      } else {
        tonConnectUI.setConnectRequestParameters(null);
      }

      return data;
    },
    enabled: isHydrated,
    refetchInterval: payloadTTLMS,
  });

  const [modalState, setModalState] = useState<
    'idle' | 'disconnecting' | 'connecting'
  >('idle');

  useEffect(() => {
    switch (modalState) {
      case 'disconnecting': {
        if (tonConnectUI.connected) {
          tonConnectUI.disconnect().then(() => {
            setTimeout(() => {
              setModalState('connecting');
            }, 200);
          });
        } else {
          setModalState('connecting');
        }

        break;
      }
      case 'connecting': {
        setShowDrawer(null);

        tonConnectUI.openModal();
        setModalState('idle');

        break;
      }

      default: {
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  const openModal = useCallback(async () => {
    setModalState('disconnecting');
  }, []);

  return {
    openModal,
  };
};
