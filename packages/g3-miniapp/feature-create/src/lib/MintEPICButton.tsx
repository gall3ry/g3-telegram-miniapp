'use client';
import { useUser } from '@gall3ry/g3-miniapp-authentication';
import { IconLock } from '@gall3ry/g3-miniapp-icon';
import { Button } from '@radix-ui/themes';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { memo, useState } from 'react';
import { ConnectWalletDrawer } from './ConnectWalletDrawer';
import { MintingDrawer } from './MintingDrawer';

export const MintEPICButton = memo(() => {
  const [, setShowDrawer] = useQueryState(
    'showDrawer',
    parseAsBoolean.withDefault(false)
  );
  const { tonProvider } = useUser();
  const [showConnectWalletDrawer, setShowConnectWalletDrawer] = useState(false);

  return (
    <>
      <MintingDrawer />
      <ConnectWalletDrawer
        open={showConnectWalletDrawer}
        onOpenChange={setShowConnectWalletDrawer}
      />

      <div className="container sticky -left-4 -right-4 bottom-20 mt-7 bg-white px-5 py-3 shadow-xl">
        <Button
          className="w-full"
          radius="large"
          size="4"
          onClick={() => {
            if (!tonProvider) {
              setShowConnectWalletDrawer(true);
              return;
            }

            void setShowDrawer(true);
          }}
        >
          <div className="size-6">
            <IconLock />
          </div>
          Mint EPIC fairy
        </Button>
      </div>
    </>
  );
});

MintEPICButton.displayName = 'MintGMOCC';
