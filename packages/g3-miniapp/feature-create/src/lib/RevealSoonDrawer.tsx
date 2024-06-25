import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { Button } from '@radix-ui/themes';
import { memo } from 'react';

export const RevealSoonDrawer = memo(
  ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="text-center text-2xl font-bold leading-9 text-slate-900">
            Share more GM to your
            <br />
            Telegram friends
          </div>

          <div className="mx-5 mt-2">
            <div className="text-center text-base font-light leading-normal tracking-tight text-slate-500">
              Share more GMs and level up your avatar to unlock more GM effects.
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[32px] bg-blue-50 px-3 pb-[5px] pt-[3px]">
              <div className="text-center text-xl font-medium leading-7 text-blue-500">
                Reveal soon
              </div>
            </div>
          </div>

          <div className="mb-3 mt-8 space-y-3 px-5">
            <Button
              size="4"
              className="w-full"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);

RevealSoonDrawer.displayName = 'RevealSoonDrawer';
