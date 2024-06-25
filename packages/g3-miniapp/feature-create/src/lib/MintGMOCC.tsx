'use client';
import { LeaderboardAvatar } from '@gall3ry/g3-miniapp-feature-home';
import { IconLock, IconPoints } from '@gall3ry/g3-miniapp-icon';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import { OccType } from '@gall3ry/types';
import { Button } from '@radix-ui/themes';
import Image from 'next/image';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { Option } from './Option';
import { useMintByTon } from './useMintByTon';

function MintingDrawer() {
  const [mintByEpicPoint, setMintByEpicPoint] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useQueryState(
    'showDrawer',
    parseAsBoolean.withDefault(false)
  );
  const { mutateAsync: mintByEpicMutateAsync } =
    api.occ.mintOCCbyEpic.useMutation();
  const utils = api.useUtils();
  const { mintByTon } = useMintByTon();

  const mintByEpic = async () => {
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
  };

  const mintOCC = async () => {
    try {
      setIsLoading(true);
      if (mintByEpicPoint) {
        await mintByEpic();
      } else {
        await mintByTon();
      }
    } catch (error) {
      console.error('Failed to mint OCC:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}

export const MintGMOCC = memo(() => {
  const { data: topOccs } = api.occ.getTopOccs.useQuery(
    { limit: 5 },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
  const [, setShowDrawer] = useQueryState(
    'showDrawer',
    parseAsBoolean.withDefault(false)
  );

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

      <MintingDrawer />

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
