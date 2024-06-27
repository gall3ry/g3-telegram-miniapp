'use client';
import { cn } from '@g3-miniapp/utils';
import { useUser } from '@gall3ry/g3-miniapp-authentication';
import { IconCheck } from '@gall3ry/g3-miniapp-icon';
import { api, RouterOutputs } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { Button } from '@radix-ui/themes';
import { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useSelectAssetsForGMDrawer } from './useSelectAssetsForGMDrawer';
export const SelectAssetDrawer = memo(() => {
  const [selectAssetsDrawer, setSelectAssetsDrawer] =
    useSelectAssetsForGMDrawer();
  const [selectedAssets, setSelectedAssets] = useState<
    NonNullable<RouterOutputs['sticker']['getGMNFTs']['result']>
  >([]);
  const { data: user } = useUser();
  const userId = user?.id;
  const utils = api.useUtils();
  const { mutateAsync: generateSticker } =
    api.sticker.generateSticker.useMutation({
      onSuccess: () => {
        void utils.sticker.getStickers.invalidate();
        void utils.sticker.getGMNFTs.invalidate();
      },
    });

  const { data, isSuccess } = api.sticker.getGMNFTs.useQuery(
    undefined,
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchInterval: ({ state: { data } }) => {
        return data?.state === 'pending' ? 10000 : false;
      },
      placeholderData: {
        state: 'pending',
        result: [],
      },
    }
  );

  const gmNFTs = data?.result ?? [];

  useEffect(() => {
    if (isSuccess && data.state === 'success') {
      setSelectedAssets(gmNFTs.filter((asset) => asset._count.Sticker > 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gmNFTs]);

  return (
    <Drawer
      open={selectAssetsDrawer}
      onOpenChange={(open) => {
        void setSelectAssetsDrawer(open);
      }}
    >
      <DrawerContent>
        <div className="min-h-[80vh] flex-col flex px-5 overflow-scroll max-h-[80vh]">
          <div className="flex justify-between items-center flex-wrap">
            <div className="text-center text-2xl font-bold leading-9 text-slate-900">
              Web3 Sticker Creation
            </div>
            <div className="mt-2 flex justify-center gap-6">
              <button
                className="text-center text-base font-medium leading-normal tracking-tight text-blue-400"
                onClick={() => {
                  if (isSuccess)
                    setSelectedAssets(gmNFTs.filter((asset) => true));
                }}
              >
                Select all
              </button>

              {isSuccess && selectedAssets.length === gmNFTs.length && (
                <button
                  onClick={() => {
                    setSelectedAssets([]);
                  }}
                  className="text-center text-base font-medium leading-normal tracking-tight text-rose-600"
                >
                  Deselect all
                </button>
              )}
            </div>
          </div>

          {data?.state === 'pending' ? (
            <div className="mt-4 text-center text-sm text-slate-700">
              Fetching latest NFTs...
            </div>
          ) : (
            <>
              <div className="mt-4">
                <Button className="font-semibold rounded-full px-3">
                  NFTs {isSuccess ? `(${gmNFTs.length})` : ''}
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {isSuccess &&
                  gmNFTs.map((asset) => {
                    const nftName = z
                      .string()
                      .default('Unknown')
                      .parse((asset.templateMetadata as any)?.nftName);

                    return (
                      <div key={asset.nftAddress}>
                        <div
                          className={cn(
                            'relative aspect-square rounded-xl bg-cover overflow-hidden',
                            {
                              'ring-[2.5px] ring-green-400':
                                selectedAssets.includes(asset),
                            }
                          )}
                          onClick={() => {
                            setSelectedAssets((prev) =>
                              prev.includes(asset)
                                ? prev.filter((a) => a !== asset)
                                : [...prev, asset]
                            );
                          }}
                        >
                          <div
                            style={{
                              backgroundImage: `url(${asset.imageUrl})`,
                              scale: 1.05,
                            }}
                            className="absolute inset-0 bg-cover"
                          />

                          <div className="absolute right-1 top-1">
                            {selectedAssets.includes(asset) ? (
                              <div className="h-6 w-6">
                                <IconCheck />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-white" />
                            )}
                          </div>
                        </div>

                        <div className="truncate text-center text-slate-700 text-sm font-semibold leading-tight tracking-tight">
                          {nftName}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          <div className="flex-1"></div>

          <div className="sticky bottom-0 pb-4 pt-4 flex gap-3 px-5 *:flex-1 bg-white">
            <Button
              size="4"
              onClick={() => setSelectAssetsDrawer(false)}
              color="gray"
              variant="soft"
            >
              Cancel
            </Button>

            <Button
              size="4"
              onClick={async () => {
                if (!userId) {
                  throw new Error('No occ id');
                }

                await toast.promise(
                  generateSticker({
                    nfts: selectedAssets.map((asset) => ({
                      nftAddress: asset.nftAddress,
                    })),
                  }),
                  {
                    loading: 'Generating sticker...',
                    success: () => {
                      void setSelectAssetsDrawer(false);

                      return 'Sticker generated';
                    },
                    error: (e) => {
                      console.log(`Failed to generate sticker:`, e);

                      return 'Failed to generate sticker';
                    },
                  }
                );
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
});

SelectAssetDrawer.displayName = 'SelectAssetDrawer';
