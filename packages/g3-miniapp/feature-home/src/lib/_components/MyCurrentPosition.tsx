'use client';
import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { IMAGES } from '@gall3ry/shared-constants';
import { Spinner } from '@radix-ui/themes';
import { LeaderboardItem } from './LeaderboardItem';

export const MyCurrentPosition = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { data, isPending, isSuccess } =
    api.occ.getMyCurrentLeaderboardPosition.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Spinner loading={isPending}>
      {isSuccess && (
        <div className="rounded-lg bg-[#F0FFF5] p-3">
          <div className="text-base font-bold leading-normal text-slate-900">
            Your current position:
          </div>

          <div className="mt-2">
            <LeaderboardItem
              occId={data.occId}
              avatarUrl={data.avatarUrl}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              occImageUrl={(IMAGES.MOCK_STICKER as any)[data.rank % 5]}
              rank={1}
              shareCount={data.shareCount}
              username={data.username}
              address={data.address}
            />
          </div>
        </div>
      )}
    </Spinner>
  );
};
