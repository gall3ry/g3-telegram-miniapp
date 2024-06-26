'use client';
import { IconPoints } from '@gall3ry/g3-miniapp-icon';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import { OccType } from '@gall3ry/types';
import { Button } from '@radix-ui/themes';
import Image from 'next/image';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Option } from './Option';
import { useMintByTon } from './useMintByTon';

export function MintingDrawer() {
  const [mintByEpicPoint, setMintByEpicPoint] = useQueryState(
    'mintByEpicPoint',
    parseAsBoolean.withDefault(true)
  );
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
