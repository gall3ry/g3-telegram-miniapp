import { cn } from '@g3-miniapp/utils';
import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { mapStickerTypeToTemplateComponent } from '@gall3ry/g3-miniapp-sticker-templates';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Button, Spinner, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo } from 'react';
import { useSelectAssetsForGMDrawer } from './useSelectAssetsForGMDrawer';

export const AllStickers = memo(() => {
  const { isAuthenticated } = useIsAuthenticated();
  const {
    data: stickersData,
    isPending: isStickersPending,
    isSuccess,
  } = api.sticker.getStickers.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: ({ state }) => {
      const data = state.data;
      const atLeastOneStickerNotReady =
        data?.items.some((sticker) => !sticker.imageUrl) ?? false;

      return atLeastOneStickerNotReady ? 5000 : false;
    },
  });
  const stickers = stickersData?.items || [];
  const [, setSelectAssetsDrawer] = useSelectAssetsForGMDrawer();
  const [, setStickerId] = useQueryState('stickerId', parseAsInteger);

  return (
    <Spinner mx="auto" loading={isStickersPending}>
      {stickers?.length === 0 && (
        <div className="my-8 flex flex-col items-center">
          <Image
            src="/images/select-asset.png"
            alt="Select asset"
            width={200}
            height={176}
          />

          <div className="mt-1 text-center text-base font-light leading-normal tracking-tight text-slate-500">
            Select your assets to start creating.
          </div>

          <div className="mt-6">
            <Button
              size="3"
              radius="large"
              onClick={() => {
                void setSelectAssetsDrawer(true);
              }}
            >
              Select TON assets
            </Button>
          </div>
        </div>
      )}

      {isSuccess && stickers.length > 0 && (
        <div className="mt-5">
          <div className="text-xl font-bold leading-7 text-slate-900">
            Sticker set
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {stickers.map((sticker) => {
              const stickerNotReady = !sticker.imageUrl;

              return (
                <div
                  key={sticker.id}
                  onClick={() => {
                    if (stickerNotReady) {
                      // Loading
                      return;
                    }

                    void setStickerId(sticker.id);
                  }}
                  className={cn(
                    'relative aspect-square w-full rounded-xl overflow-hidden',
                    {
                      'cursor-not-allowed': stickerNotReady,
                    }
                  )}
                >
                  <div className="aspect-square cursor-pointer">
                    {sticker.GMNFT.imageUrl &&
                      mapStickerTypeToTemplateComponent(sticker.stickerType, {
                        imageUrl: sticker.GMNFT.imageUrl,
                        stickerTitle: `STICKER #${sticker.id}`,
                        shouldRecord: false,
                        type: sticker.stickerType,
                      })}
                  </div>

                  <div className="absolute bottom-2 left-2 h-6 rounded-lg bg-white px-2 py-0.5">
                    <div className="text-center text-sm font-bold leading-tight text-slate-900">
                      {sticker.shareCount} share
                      {sticker.shareCount === 1 ? '' : 's'}
                    </div>
                  </div>

                  {stickerNotReady && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2">
                      <Spinner />
                      <Text color="gray">Loading...</Text>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Spinner>
  );
});

AllStickers.displayName = 'AllStickers';
