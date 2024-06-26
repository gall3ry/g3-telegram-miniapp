'use client';
import { Button, Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import Image from 'next/image';
import { parseAsBoolean, useQueryState } from 'nuqs';

export const ConnectWalletDrawer = ({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) => {
  const [, setShowDrawer] = useQueryState(
    'showDrawer',
    parseAsBoolean.withDefault(false)
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="aspect-[335/202] w-full relative">
          <Image
            fill
            src={IMAGES.create.connect_ton_required}
            alt="Connect TON required"
          />
        </div>

        <div className="mt-4 text-center text-slate-900 text-2xl font-bold leading-9">
          Connect your TON wallet
        </div>

        <div className="mt-2 text-slate-500 text-base font-light leading-normal tracking-tight px-5 text-center">
          Please connect your TON wallet to unlock <br /> and start creating GM
          Epic.
        </div>

        <div className="mt-8 *:flex-1 flex gap-2 px-5 mb-4">
          <Button
            size="big"
            variant="secondary"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="big"
            onClick={() => {
              onOpenChange(false);
              setShowDrawer(true);
            }}
          >
            Connect now
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
