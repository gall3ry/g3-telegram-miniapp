'use client';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
export const useWaitAndConnectProvider = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { mutateAsync: connectMoreProvider } =
    api.auth.connectMoreProvider.useMutation();

  useEffect(() => {
    if (tonConnectUI) {
      console.log(`registering onStatusChange`);
      return tonConnectUI.onStatusChange(
        async (w) => {
          console.log(`onStatusChange`, w);
          if (!w) {
            return;
          }

          if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
            console.log({
              tonProof: w.connectItems.tonProof,
              account: w.account,
              publicKey: w.account.publicKey,
            });
            if (!w.account.publicKey) {
              throw new Error('Public key is missing');
            }

            // Require is authenticated
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
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tonConnectUI]);

  return {};
};
