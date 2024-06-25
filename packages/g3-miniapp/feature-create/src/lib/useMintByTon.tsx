'use client';
import { useUser } from '@gall3ry/g3-miniapp-authentication';
import { env } from '@gall3ry/g3-miniapp-env';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { OccType } from '@gall3ry/types';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { parseAsBoolean, useQueryState } from 'nuqs';
import toast from 'react-hot-toast';
import { MOCK_TX_HASH } from './MOCK_TX_HASH';
import { useNftContract } from './_hooks/useNftContract';
import { useOpenConnectTonProviderModal } from './useOpenConnectTonProviderModal';
export const useMintByTon = () => {
  const { tonProvider } = useUser();
  const [tonConnectUI] = useTonConnectUI();
  const { openModal } = useOpenConnectTonProviderModal();
  const { sendMintNftFromFaucet } = useNftContract();
  const { mutateAsync } = api.occ.mintOCCbyTON.useMutation();
  const [, setShowDrawer] = useQueryState(
    'showDrawer',
    parseAsBoolean.withDefault(false)
  );
  const utils = api.useUtils();
  const mintByTon = async () => {
    if (!tonProvider || !tonConnectUI.connected) {
      await openModal();

      // For the modal to open
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
      return;
    }
    try {
      console.log('NEXT_PUBLIC_G3_ENV');
      const txHash =
        env.NEXT_PUBLIC_G3_ENV === 'development'
          ? MOCK_TX_HASH
          : await sendMintNftFromFaucet({
              name: 'Name Of NFT #6',
              description: 'NFT Description',
              image:
                'ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg',
            });

      await toast.promise(
        mutateAsync({
          type: OccType.GMSymbolOCC,
          txHash,
        }),
        {
          loading: 'Creating OCC...',
          success: () => {
            void utils.occ.getOcc.invalidate();
            void setShowDrawer(null);

            return 'OCC created';
          },
          error: (e) => {
            console.log(`Failed to create OCC:`, e);

            return 'Failed to create OCC';
          },
        }
      );
    } catch (error) {
      console.error('Failed to mint OCC:', error);
    }
  };

  return {
    mintByTon,
  };
};
