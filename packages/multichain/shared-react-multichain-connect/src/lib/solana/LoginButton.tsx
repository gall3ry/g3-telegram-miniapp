import { useAuth } from '@gall3ry/g3-miniapp-global-store';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { multichainSignatureValidationList } from '@gall3ry/multichain/shared-multichain-signature-validation';
import { Button } from '@radix-ui/themes';
import { WalletName } from '@solana/wallet-adapter-base';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Providers } from './Providers';

const Inner = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: signIn } = api.auth.web3SignIn.useMutation();
  const { setAccessToken } = useAuth();
  const { signMessage: signMessageAsync, signIn: solanaSignIn } = useWallet();
  const [, setWalletModalConfig] = useState<Readonly<{
    onSelectWallet(walletName: WalletName): void;
    wallets: Wallet[];
  }> | null>(null);

  const { buttonState } = useWalletMultiButton({
    onSelectWallet: setWalletModalConfig,
  });
  const buttonClicked = useRef(false);
  const { setVisible } = useWalletModal();

  const signMessage = async () => {
    const address = publicKey?.toBase58();
    const isConnected = buttonState === 'connected';

    if (!isConnected || !address) {
      setVisible(true);
      return;
    }
    if (!solanaSignIn) {
      throw new Error('Sign message not found');
    }
    if (!signMessageAsync) {
      throw new Error('Sign message not found');
    }

    const uri = `${window.location.protocol}//${window.location.host}`;
    const input: SolanaSignInInput = JSON.parse(
      await multichainSignatureValidationList.SOLANA_WALLET.prepareMessage({
        address: address,
        uri,
      })
    );
    const output = await solanaSignIn(input);
    const { token } = await toast.promise(
      signIn({
        input: JSON.stringify(input),
        output: JSON.stringify({
          ...output,
          account: {
            ...output.account,
            publicKey: output.account.publicKey,
            address: output.account.address,
            chains: output.account.chains,
            features: output.account.features,
            icon: output.account.icon,
            label: output.account.label,
          },
        } satisfies SolanaSignInOutput),
        type: 'SOLANA_WALLET',
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
    if (buttonState === 'connected' && buttonClicked.current) {
      signMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonState]);

  return (
    <Button
      onClick={() => {
        if (buttonState === 'connected') {
          signMessage();
        } else {
          buttonClicked.current = true;
          setVisible(true);
        }
      }}
      className="w-full"
    >
      Login with solana wallet
    </Button>
  );
};

export const LoginButton = () => {
  return (
    <Providers>
      <Inner />
    </Providers>
  );
};
