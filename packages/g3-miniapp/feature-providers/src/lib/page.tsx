'use client';

import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { useAuth } from '@gall3ry/g3-miniapp-global-store';
import { multichainConnectComponent } from '@gall3ry/multichain/shared-react-multichain-connect';
import { Button, Heading } from '@radix-ui/themes';
import { Suspense } from 'react';

const Page = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { reset } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <Button
          onClick={() => {
            reset();
          }}
        >
          Logout
        </Button>
      ) : (
        <>
          <Heading>Login with</Heading>

          <div className="grid gap-2">
            {Object.entries(multichainConnectComponent).map(([key, value]) => {
              const ConnectButton = value.connectAndSignMessage();

              return (
                <Suspense>
                  <ConnectButton key={key} />
                </Suspense>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export { Page };
