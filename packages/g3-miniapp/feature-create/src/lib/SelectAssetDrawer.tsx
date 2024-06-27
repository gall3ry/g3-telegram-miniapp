'use client';
import { cn } from '@g3-miniapp/utils';
import { useUser } from '@gall3ry/g3-miniapp-authentication';
import { IconCheck } from '@gall3ry/g3-miniapp-icon';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { Button } from '@radix-ui/themes';
import { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { mockAssets } from './MOCK_ASSET';
import { useSelectAssetsForGMDrawer } from './useSelectAssetsForGMDrawer';
export const SelectAssetDrawer = memo(() => {
  const [selectAssetsDrawer, setSelectAssetsDrawer] =
    useSelectAssetsForGMDrawer();
  const [selectedAssets, setSelectedAssets] = useState<
    (typeof mockAssets)[number][]
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
  const { data: occ } = api.occ.getOcc.useQuery(undefined, {
    enabled: true,
  });
  const { data: gmNFTs, isSuccess } = api.sticker.getGMNFTs.useQuery(
    undefined,
    {
      enabled: true,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      const addresses = mockAssets.filter((asset) => {
        return gmNFTs.some((gmNFT) => gmNFT.imageUrl === asset.imageUrl);
      });

      setSelectedAssets(addresses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <Drawer
      open={selectAssetsDrawer}
      onOpenChange={(open) => {
        void setSelectAssetsDrawer(open);
      }}
    >
      <DrawerContent>
        <div className="min-h-[80vh] flex-col flex px-5">
          <div className="flex justify-between items-center">
            <div className="text-center text-2xl font-bold leading-9 text-slate-900">
              Web3 Sticker Creation
            </div>
            <div className="mt-2 flex justify-center gap-6">
              <button
                className="text-center text-base font-medium leading-normal tracking-tight text-blue-400"
                onClick={() => {
                  setSelectedAssets(mockAssets.filter((asset) => true));
                }}
              >
                Select all
              </button>

              {selectedAssets.length === mockAssets.length && (
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

          <div className="mt-4">
            <Button className="font-semibold rounded-full px-3">
              NFTs (5)
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {mockAssets.map((asset) => (
              <div
                className={cn(
                  'relative aspect-square rounded-xl bg-cover overflow-hidden',
                  {
                    'ring-[2.5px] ring-green-400':
                      selectedAssets.includes(asset),
                  }
                )}
                key={asset.imageUrl}
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
            ))}
          </div>

          <div className="flex-1"></div>

          <div className="sticky bottom-4 mb-4 mt-4 flex gap-3 px-5 *:flex-1">
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
                if (!occ?.id || !userId) {
                  throw new Error('No occ id');
                }

                await toast.promise(
                  generateSticker({
                    nfts: selectedAssets.map((asset) => ({
                      imageUrl: asset.imageUrl,
                      nftAddress: `${userId}-${asset.nftAddress}`,
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
