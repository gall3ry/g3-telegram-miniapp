'use client';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Button } from '@gall3ry/g3-miniapp-ui';
import { Spinner } from '@radix-ui/themes';
import { useSelectAssetsForGMDrawer } from './useSelectAssetsForGMDrawer';

export const SelectedAssets = () => {
  const [, setSelectAssetsDrawer] = useSelectAssetsForGMDrawer();
  const {
    data: gmNFTs,
    isSuccess,
    isPending,
  } = api.sticker.getGMNFTs.useQuery(undefined, {
    enabled: true,
  });

  return (
    <Spinner loading={isPending}>
      {isSuccess && (gmNFTs.result?.length || 0) > 0 && (
        <Button
          size="big"
          variant="secondary"
          onClick={() => {
            void setSelectAssetsDrawer(true);
          }}
          className="w-full"
        >
          Edit assets
        </Button>
      )}
    </Spinner>
  );
};
