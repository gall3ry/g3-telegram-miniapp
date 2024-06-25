import { useAuth } from '@gall3ry/g3-miniapp-global-store';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { multichainSignatureValidationList } from '@gall3ry/multichain/shared-multichain-signature-validation';
import { Button } from '@radix-ui/themes';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { Providers } from './Providers';

export const ConnectButton: React.FC = () => {
  return (
    <Providers>
      <Inner />
    </Providers>
  );
};

const Inner = () => {
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync } = useSignMessage();
  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { mutateAsync: signIn } = api.auth.signIn.useMutation();
  const { setAccessToken } = useAuth();
  const buttonClicked = useRef(false);

  const signMessage = async () => {
    if (!isConnected || !address) {
      if (!openConnectModal) {
        throw new Error('Open connect modal not found');
      }

      openConnectModal();
      return;
    }

    // current website

    const uri = `${window.location.protocol}//${window.location.host}`;
    const message =
      await multichainSignatureValidationList.EVM_WALLET.prepareMessage({
        address: address,
        uri,
      });
    const signature = await signMessageAsync({
      message,
    });

    const { token } = await toast.promise(
      signIn({
        address,
        message,
        signature,
        type: 'EVM_WALLET',
      }),
      {
        loading: 'Signing in...',
        success: 'Signed in successfully',
        error: 'Failed to sign in',
      }
    );

    setAccessToken(token);
  };

  useEffect(() => {
    if (isConnected && buttonClicked.current) {
      signMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <div>
      <Button
        onClick={async () => {
          buttonClicked.current = true;
          await disconnectAsync(
            {},
            {
              onSuccess: () => {
                if (!openConnectModal) {
                  throw new Error('Open connect modal not found');
                }
                openConnectModal?.();
              },
            }
          );
        }}
        className="w-full"
      >
        Connect with EVM Wallet
      </Button>
    </div>
  );
};
