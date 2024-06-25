'use client';
import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { IconAsset, IconEffect } from '@gall3ry/g3-miniapp-icon';
import { mapStickerTypeToTemplateComponent } from '@gall3ry/g3-miniapp-sticker-templates';
import { useWebAppSwitchInlineQuery } from '@gall3ry/g3-miniapp-telegram-miniapp-utils';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import { Button, Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo, useState } from 'react';
import { AllStickers } from './AllStickers';
import { MintGMOCC } from './MintGMOCC';
import { RevealSoonDrawer } from './RevealSoonDrawer';
import { SelectAssetDrawer } from './SelectAssetDrawer';
import { SelectedAssets } from './SelectedAssets';

export const MintOCC = memo(() => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data: occ, isPending } = api.occ.getOcc.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: stickersData } = api.sticker.getStickers.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [stickerId, setStickerId] = useQueryState('stickerId', parseAsInteger);
  const { postSwitchInlineQuery } = useWebAppSwitchInlineQuery();
  const stickers = stickersData?.items;
  const selectedSticker = stickers?.find((s) => s.id === stickerId);
  const [showRevealSoonDrawer, setShowRevealSoonDrawer] = useState(false);

  if (isPending) return <Spinner mx="auto" />;

  return occ ? (
    <div className="px-4">
      <div className="flex h-16 rounded-xl bg-slate-900 px-[14px] py-3 opacity-80">
        <div className="flex items-center gap-2.5">
          <Image
            src={IMAGES.create.icon_level_1}
            alt=""
            height={40}
            width={40}
            className="rounded-full"
          />

          <div>
            <div className="text-base font-medium leading-normal tracking-tight text-white">
              Level
            </div>

            <button
              className="inline-flex h-[21px] items-center justify-center gap-2.5 rounded-[32px] bg-blue-50 px-2 pb-0.5 pt-px"
              onClick={() => {
                setShowRevealSoonDrawer(true);
              }}
            >
              <div className="text-center text-xs font-medium leading-[18px] tracking-tight text-blue-500">
                Reveal soon
              </div>
            </button>
          </div>
        </div>

        <div className="mx-5 h-full w-px bg-white opacity-20"></div>

        <div className="flex items-center gap-2.5">
          <Image
            src={IMAGES.create.icon_chart_2}
            alt=""
            height={40}
            width={40}
            className="rounded-full"
          />

          <div>
            <div className="text-base font-medium leading-normal tracking-tight text-white">
              Share
            </div>

            <div className="text-center text-2xl font-bold leading-none text-white">
              {Intl.NumberFormat().format(occ.totalShare)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <SelectedAssets />
      </div>

      <AllStickers />

      <SelectAssetDrawer />

      <RevealSoonDrawer
        open={showRevealSoonDrawer}
        onOpenChange={setShowRevealSoonDrawer}
      />

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
              {selectedSticker?.GMNFT.imageUrl &&
                mapStickerTypeToTemplateComponent(selectedSticker.stickerType, {
                  stickerTitle: `STICKER #${selectedSticker.id}`,
                  imageUrl: selectedSticker.GMNFT.imageUrl,
                })}
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
                disabled={!selectedSticker?.imageUrl}
              >
                {selectedSticker?.imageUrl ? 'Send Sticker' : 'Loading...'}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  ) : (
    <MintGMOCC />
  );
});

MintOCC.displayName = 'MintOCC';
