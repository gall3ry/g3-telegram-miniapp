import { env } from '@gall3ry/g3-miniapp-env';
import { useAuthHydrated } from '@gall3ry/g3-miniapp-global-store';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { useQuery } from '@tanstack/react-query';
import { TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const payloadTTLMS = 1000 * 60 * 9; // 9 minutes

const InnerProvider = ({ children }: { children: React.ReactNode }) => {
  const isHydrated = useAuthHydrated();
  const [tonConnectUI] = useTonConnectUI();
  const { refetch: fetchPayload } = api.auth.generatePayload.useQuery(
    undefined,
    {
      enabled: false,
    }
  );
  const { mutateAsync: connectMoreProvider } =
    api.auth.connectMoreProvider.useMutation();

  // Fetch proof payload
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

  // On login success, check proof and set access token
  useEffect(() => {
    if (tonConnectUI && isHydrated) {
      const unsubscribeModal = tonConnectUI.onStatusChange(async (w) => {
        if (!w) {
          // reset();
          // void utils.invalidate();

          return;
        }

        // let _accessToken = accessToken;

        if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
          if (!w.account.publicKey) {
            throw new Error('Public key is missing');
          }

          await toast.promise(
            connectMoreProvider({
              type: 'TON_WALLET',
              proof: {
                address: w.account.address,
                network: w.account.chain,
                public_key: w.account.publicKey,
                proof: {
                  ...w.connectItems.tonProof.proof,
                  state_init: w.account.walletStateInit,
                },
              },
            }),
            {
              loading: 'Connecting...',
              success: () => {
                // void utils.invalidate();
                return 'Connected';
              },
              error: (e) => {
                console.error('Failed to connect', e);
                return 'Failed to connect';
              },
            }
          );

          // _accessToken = token;
          // setAccessToken(_accessToken);
          // void utils.invalidate();
        }

        // if (!_accessToken) {
        //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
        //   tonConnectUI.disconnect();
        //   // void utils.invalidate();
        //   return;
        // }
      });

      return () => {
        unsubscribeModal();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonConnectUI, isHydrated]);

  return <Providers>{children}</Providers>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <OuterProvider>
    <InnerProvider>{children}</InnerProvider>
  </OuterProvider>
);

export const OuterProvider = ({ children }: { children: React.ReactNode }) => (
  <TonConnectUIProvider manifestUrl={env.NEXT_PUBLIC_TWA_MANIFEST_URL}>
    {children}
  </TonConnectUIProvider>
);
