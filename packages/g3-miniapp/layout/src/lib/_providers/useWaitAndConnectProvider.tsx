'use client';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import toast from 'react-hot-toast';
export const useWaitAndConnectProvider = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { mutateAsync: connectMoreProvider } =
    api.auth.connectMoreProvider.useMutation();
  const [goToCreate, setGoToCreate] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    if (goToCreate && router) {
      router.push('/create?showDrawer=true&mintByEpicPoint=false');
      router.refresh();
    }
  }, [goToCreate, router]);

  useEffect(() => {
    if (tonConnectUI) {
      console.log(`registering onStatusChange`);
      return tonConnectUI.onStatusChange(
        async (w) => {
          if (!w) {
            return;
          }

          if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
            if (!w.account.publicKey) {
              throw new Error('Public key is missing');
            }

            // Require is authenticated
            connectMoreProvider(
              {
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
              },
              {
                onSuccess: () => {
                  setGoToCreate(true);

                  toast.success('TON Wallet connected');
                },
                onError: (e) => {
                  console.error('Failed to connect', e);
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
