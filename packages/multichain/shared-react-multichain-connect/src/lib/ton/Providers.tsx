import { env } from '@gall3ry/g3-miniapp-env';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <OuterProvider>{children}</OuterProvider>
);

export const OuterProvider = ({ children }: { children: React.ReactNode }) => (
  <TonConnectUIProvider
    manifestUrl={env.NEXT_PUBLIC_TWA_MANIFEST_URL}
    actionsConfiguration={{
      returnStrategy: 'back',
      twaReturnUrl: env.NEXT_PUBLIC_TWA_RETURN_URL as `${string}://${string}`,
    }}
  >
    {children}
  </TonConnectUIProvider>
);
