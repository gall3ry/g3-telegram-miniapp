'use client';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { IMAGES } from '@gall3ry/shared-constants';
import { Spinner } from '@radix-ui/themes';
import { usePostHog } from 'posthog-js/react';
import React, { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { LeaderboardItem } from './LeaderboardItem';

export const Leaderboard = () => {
  const LIMIT = 10;
  const [ref, inView] = useInView({
    threshold: 0,
  });
  const { data, fetchNextPage, isFetching } =
    api.occ.getLeaderboard.useInfiniteQuery(
      {
        limit: LIMIT,
      },
      {
        enabled: true,
        getNextPageParam: (lastPage) => {
          if (lastPage.data.length < LIMIT) {
            return undefined;
          }

          return lastPage.nextCursor;
        },
      }
    );
  const { featureFlags } = usePostHog();

  React.useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const leaderboardEnabled = useMemo(
    () =>
      featureFlags.isFeatureEnabled('leaderboard', {
        send_event: false,
      }),
    [featureFlags]
  );

  if (leaderboardEnabled === false) {
    return null;
  }

  return (
    <>
      {data?.pages
        ?.map(({ data: page }, pageIndex) =>
          page.map((item, index) => (
            <LazyLoadComponent key={index}>
              <LeaderboardItem
                occId={item.id}
                rank={pageIndex * LIMIT + index + 1}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                occImageUrl={(IMAGES.MOCK_STICKER as any)[(index % 5) + 1]}
                avatarUrl={item.avatarUrl}
                username={item.displayName ?? '?'}
                shareCount={item.shareCount}
                address={item.address}
              />
            </LazyLoadComponent>
          ))
        )
        .flat()}

      {/* Load more */}
      <div ref={ref} />

      {/* Loading */}
      {isFetching && <Spinner className="mx-auto mt-8" />}
    </>
  );
};
