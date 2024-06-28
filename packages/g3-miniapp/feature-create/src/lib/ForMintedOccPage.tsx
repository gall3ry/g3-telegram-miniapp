'use client';
import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { Sticker } from '@gall3ry/g3-miniapp-feature-stickers';
import {
  IconAsset,
  IconEffect,
  IconInfoCircled,
} from '@gall3ry/g3-miniapp-icon';
import { useWebAppSwitchInlineQuery } from '@gall3ry/g3-miniapp-telegram-miniapp-utils';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import { Button } from '@radix-ui/themes';
import Image from 'next/image';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useState } from 'react';
import { AllStickers } from './AllStickers';
import { HelpDrawer } from './HelpDrawer';
import { LevelBar } from './LevelBar';
import { RevealSoonDrawer } from './RevealSoonDrawer';
import { SelectAssetDrawer } from './SelectAssetDrawer';
import { SelectedAssets } from './SelectedAssets';
import { useHelpDrawer } from './useHelpDrawer';

export const ForMintedOccPage = () => {
  const [showRevealSoonDrawer, setShowRevealSoonDrawer] = useState(false);

  return (
    <div className="px-4">
      <TopOCCInfo />
      <div className="mt-5">
        <SelectedAssets />
      </div>
      <AllStickers />
      <SelectAssetDrawer />
      <RevealSoonDrawer
        open={showRevealSoonDrawer}
        onOpenChange={setShowRevealSoonDrawer}
      />
      <SingleStickerDetailDrawer />
    </div>
  );
};

ForMintedOccPage.displayName = 'ForMintedOccPage';

export const SingleStickerDetailDrawer = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data: stickersData } = api.sticker.getStickers.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [stickerId, setStickerId] = useQueryState('stickerId', parseAsInteger);
  const { postSwitchInlineQuery } = useWebAppSwitchInlineQuery();
  const stickers = stickersData?.items;
  const selectedSticker = stickers?.find((s) => s.id === stickerId);

  return (
    <Drawer
      open={stickerId !== null}
      onOpenChange={(open) => {
        if (!open) {
          void setStickerId(null);
        }
      }}
    >
      <DrawerContent>
        <div className="px-5">
          <div className="aspect-square w-full rounded-xl">
            {selectedSticker && (
              <Sticker sticker={selectedSticker} shouldRecord={false} />
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-center text-4xl font-bold leading-[44px] text-slate-900">
            Sticker #{selectedSticker?.id}
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="size-6">
              <IconAsset />
            </div>
            <div className="text-base font-medium leading-normal tracking-tight text-slate-500">
              Asset:
            </div>
            <div className="text-base font-bold leading-normal text-slate-900">
              ShadowStriker
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-6">
              <IconEffect />
            </div>
            <div className="text-base font-medium leading-normal tracking-tight text-slate-500">
              Effect
            </div>
            <div className="text-base font-bold leading-normal text-slate-900">
              Effect name
            </div>
          </div>
        </div>

        <div className="mt-8 px-5 pb-4">
          <div className="flex gap-3 *:flex-1">
            <Button
              size="4"
              onClick={() => {
                void setStickerId(null);
              }}
              color="gray"
              variant="soft"
            >
              Cancel
            </Button>

            <Button
              size="4"
              onClick={() => {
                postSwitchInlineQuery({
                  query: `${stickerId}`,
                  chatTypes: ['channels', 'groups', 'users'],
                });
              }}
              disabled={!selectedSticker?.telegramFileId}
            >
              {selectedSticker?.telegramFileId ? 'Send Sticker' : 'Loading...'}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const TopOCCInfo = () => {
  const [showHelpDrawer, setShowHelpDrawer] = useHelpDrawer();
  const [data] = api.occ.getOcc.useSuspenseQuery();
  const exp = data?.GMSymbolOCC?.exp ?? 0;
  const max = 100;

  return (
    <>
      <div className="aspect-[335/120] w-full rounded-xl relative">
        <Image
          src={IMAGES.balance_bg}
          fill
          alt="Balance background"
          sizes="100vw"
          priority
        />

        <div className="absolute inset-0 flex w-full p-4">
          <div className="h-full aspect-square rounded-lg overflow-hidden relative">
            <Image
              fill
              src={IMAGES.create.fairy}
              priority
              alt="Fairy"
              sizes="25vw"
            />
          </div>

          <div className="ml-5 grow">
            {/* Button */}
            <div className="flex justify-between items-end">
              <div className="text-white text-2xl font-bold leading-none">
                EPIC Fairy
              </div>

              <button
                className="w-7 h-7 bg-opacity-20 bg-white rounded-lg fill-white flex items-center justify-center p-1 hover:bg-opacity-30"
                onClick={() => setShowHelpDrawer(true)}
              >
                <IconInfoCircled />
              </button>
            </div>

            <div className="relative mt-3 bg-opacity-10 bg-white rounded p-2 flex gap-2 items-center py-2.5">
              <div className="w-8 h-8 relative">
                <Image src={IMAGES.level[1]} alt="Level 1" fill sizes="10vw" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-white text-base font-bold leading-normal">
                    Level 1
                  </div>

                  <div className="flex-1"></div>

                  <div>
                    <span className="text-white text-sm font-semibold leading-tight tracking-tight">
                      {exp}
                    </span>
                    <span className="opacity-60 text-white text-sm font-semibold leading-tight tracking-tight">
                      /{max}
                    </span>
                  </div>
                </div>

                <div className="mt-1">
                  <LevelBar percentage={exp / max} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HelpDrawer open={showHelpDrawer} onOpenChange={setShowHelpDrawer} />
    </>
  );
};
