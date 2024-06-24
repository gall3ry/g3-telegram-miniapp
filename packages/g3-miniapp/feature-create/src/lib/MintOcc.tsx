'use client';
import { cn } from '@g3-miniapp/utils';
import {
  useIsAuthenticated,
  useUser,
} from '@gall3ry/g3-miniapp-authentication';
import { env } from '@gall3ry/g3-miniapp-env';
import { LeaderboardAvatar } from '@gall3ry/g3-miniapp-feature-home';
import {
  IconAsset,
  IconCheck,
  IconEffect,
  IconLock,
  IconPoints,
} from '@gall3ry/g3-miniapp-icon';
import { mapStickerTypeToTemplateComponent } from '@gall3ry/g3-miniapp-sticker-templates';
import { useWebAppSwitchInlineQuery } from '@gall3ry/g3-miniapp-telegram-miniapp-utils';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import { OccType } from '@gall3ry/types';
import { Button, Spinner, Text } from '@radix-ui/themes';
import { useInitData } from '@tma.js/sdk-react';
import Image from 'next/image';
import { parseAsBoolean, parseAsInteger, useQueryState } from 'nuqs';
import { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNftContract } from './_hooks/useNftContract';
import { mockAssets } from './MOCK_ASSET';
import { MOCK_TX_HASH } from './MOCK_TX_HASH';
import { Option } from './Option';
import { SelectedAssets } from './SelectedAssets';
import { useSelectAssetsForGMDrawer } from './useSelectAssetsForGMDrawer';

export const MintOCC = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data: occ, isPending } = api.occ.getOcc.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: stickersData } = api.sticker.getStickers.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const initData = useInitData(true);
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

      {/* <Skeleton width="30" height="10" loading={isStickersPending}>
        <div className="mt-5">
          {isSuccess && (
            <div className="text-xl font-bold leading-7 text-slate-900">
              Effect inventory ({stickersData.total})
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          <EffectItem imageUrl={IMAGES.MOCK_OCC[1]} isSelected />

          <EffectItem
            imageUrl={IMAGES.MOCK_OCC[2]}
            isDisabled
            disabledContent={{
              title: "Level 2",
              buttonText: "Unlock",
              onClick: () => {
                toast.error("Feature not available yet");
              },
            }}
          />

          <EffectItem
            imageUrl={IMAGES.MOCK_OCC[3]}
            isDisabled
            disabledContent={{
              title: "Level 3",
              buttonText: "Unlock",
              onClick: () => {
                toast.error("Feature not available yet");
              },
            }}
          />
          <EffectItem
            imageUrl={IMAGES.MOCK_OCC[4]}
            isDisabled
            disabledContent={{
              title: "Level 4",
              buttonText: "Unlock",
              onClick: () => {
                toast.error("Feature not available yet");
              },
            }}
          />
        </div>
      </Skeleton> */}

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
};

export const MintGMOCC = memo(() => {
  const { sendMintNftFromFaucet } = useNftContract();
  // const { mutateAsync } = api.occ.createOCC.useMutation();
  const { mutateAsync } = api.occ.mintOCCbyTON.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: mintByEpicMutateAsync } =
    api.occ.mintOCCbyEpic.useMutation();
  const [mintByEpicPoint, setMintByEpicPoint] = useState(true);
  const [showDrawer, setShowDrawer] = useQueryState(
    'showDrawer',
    parseAsBoolean.withDefault(false)
  );
  const utils = api.useUtils();
  const { data: topOccs } = api.occ.getTopOccs.useQuery({ limit: 5 });

  const mintByEpic = async () => {
    setIsLoading(true);
    try {
      await toast.promise(
        mintByEpicMutateAsync({
          type: OccType.GMSymbolOCC,
        }),
        {
          loading: 'Creating OCC...',
          success: () => {
            void utils.occ.getOcc.invalidate();
            void setShowDrawer(null);

            return 'OCC created';
          },
          error: (e) => {
            console.log(`Failed to create OCC:`, e);

            return 'Failed to create OCC';
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const mintByTon = async () => {
    setIsLoading(true);
    try {
      const txHash =
        env.NEXT_PUBLIC_G3_ENV === 'development'
          ? MOCK_TX_HASH
          : await sendMintNftFromFaucet({
              name: 'Name Of NFT #6',
              description: 'NFT Description',
              image:
                'ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg',
            });

      await toast.promise(
        mutateAsync({
          type: OccType.GMSymbolOCC,
          txHash,
        }),
        {
          loading: 'Creating OCC...',
          success: () => {
            void utils.occ.getOcc.invalidate();
            void setShowDrawer(null);

            return 'OCC created';
          },
          error: (e) => {
            console.log(`Failed to create OCC:`, e);

            return 'Failed to create OCC';
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };
  const mintOCC = async () => {
    if (mintByEpicPoint) {
      await mintByEpic();
    } else {
      await mintByTon();
    }
  };

  return (
    <div>
      <div className="mt-4 px-4">
        <div className="text-center text-2xl font-bold leading-9 text-black">
          Unlock Your Creativity
          <br />
          with GM EPIC
        </div>

        <div className="mt-2 text-center text-sm font-light leading-tight tracking-tight text-slate-700">
          Want to show off your sticker ownership with daily messages? Mint GM,
          customize your content, and share more to level up and collect points
          for the $EPIC Airdrops (TBA).
        </div>

        <div className="mt-6">
          <Image
            className="aspect-square w-full rounded-xl"
            src={IMAGES.create.gm}
            alt=""
            width="335"
            height="335"
          />
        </div>

        <div className="mt-5">
          <div className="text-center text-xl font-bold leading-7 text-slate-900">
            Top 5 GMs
          </div>
        </div>

        <div className="mt-4 flex">
          {topOccs?.occs.map(
            (item, index) =>
              item.imageUrl && (
                <div key={item.id}>
                  <LeaderboardAvatar
                    key={index}
                    occId={item.id}
                    occImageUrl={IMAGES.create.gm}
                    rank={index + 1}
                  />
                  <div className="ml-3 mt-1.5 flex items-center gap-1.5">
                    <div className="text-xl font-bold leading-7 text-green-600">
                      {item.shareCount}
                    </div>
                    <div className="text-sm font-medium leading-tight tracking-tight text-slate-900">
                      share{item.shareCount === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      <Drawer
        open={showDrawer}
        onOpenChange={(open) => {
          void setShowDrawer(open);
        }}
      >
        <DrawerContent>
          <div className="text-center text-2xl font-bold leading-9 text-slate-900">
            Minting fee
          </div>

          <div className="mt-2">
            <div className="w-[335px] text-center text-base font-light leading-normal tracking-tight text-slate-500">
              You can pay minting with $EPIC or $TON:
            </div>
          </div>

          <div className="mt-5">
            <div defaultValue="1" className="grid gap-3 px-5">
              <Option
                onClick={() => setMintByEpicPoint(true)}
                icon={<IconPoints />}
                text="100 EPIC"
                isActive={mintByEpicPoint}
              />

              <Option
                onClick={() => setMintByEpicPoint(false)}
                icon={
                  <Image
                    src={IMAGES.create.ton_logo}
                    width={24}
                    height={24}
                    alt=""
                  />
                }
                text="0.3 TON"
                isActive={!mintByEpicPoint}
              />
            </div>
          </div>

          <div className="mb-3 mt-8 space-y-3 px-5">
            <Button
              size="4"
              onClick={mintOCC}
              className="w-full"
              loading={isLoading}
            >
              Confirm to mint
            </Button>
            <Button
              size="4"
              className="w-full"
              color="gray"
              variant="soft"
              onClick={() => setShowDrawer(false)}
            >
              Cancel
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="container sticky -left-4 -right-4 bottom-20 mt-7 bg-white px-5 py-3 shadow-xl">
        <Button
          className="w-full"
          radius="large"
          size="4"
          onClick={() => {
            void setShowDrawer(true);
          }}
        >
          <div className="size-6">
            <IconLock />
          </div>
          MINT GM UGC TEMPLATE
        </Button>
      </div>
    </div>
  );
});

MintGMOCC.displayName = 'MintGMOCC';

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
        <div className="text-center text-2xl font-bold leading-9 text-slate-900">
          GM Creation
        </div>
        <div className="mt-2 flex justify-center gap-6">
          <button
            className="text-center text-base font-medium leading-normal tracking-tight text-blue-400"
            onClick={() => {
              setSelectedAssets(
                mockAssets.filter((asset) => !selectedAssets.includes(asset))
              );
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

        <div className="mt-6 grid grid-cols-4 gap-2 px-5">
          {mockAssets.map((asset) => (
            <div
              className="relative h-[78px] w-[78px] rounded-xl bg-cover"
              key={asset.imageUrl}
              style={{
                backgroundImage: `url(${asset.imageUrl})`,
              }}
              onClick={() => {
                setSelectedAssets((prev) =>
                  prev.includes(asset)
                    ? prev.filter((a) => a !== asset)
                    : [...prev, asset]
                );
              }}
            >
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

        <div className="mb-4 mt-4 flex gap-3 px-5 *:flex-1">
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
      </DrawerContent>
    </Drawer>
  );
});

SelectAssetDrawer.displayName = 'SelectAssetDrawer';

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

export const AllStickers = memo(() => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data: stickersData, isPending: isStickersPending } =
    api.sticker.getStickers.useQuery(undefined, {
      enabled: isAuthenticated,
      refetchInterval: ({ state }) => {
        const data = state.data;
        const atLeastOneStickerNotReady =
          data?.items.some((sticker) => !sticker.imageUrl) ?? false;

        return atLeastOneStickerNotReady ? 5000 : false;
      },
    });
  const stickers = stickersData?.items;
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

          <div className="text-center text-2xl font-bold leading-9 text-slate-900">
            Mint and say GM!
            <br />
            with your assets
          </div>
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
              Select assets
            </Button>
          </div>
        </div>
      )}

      {stickers && stickers.length > 0 && (
        <div className="mt-5">
          <div className="text-xl font-bold leading-7 text-slate-900">
            Created UGC list
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