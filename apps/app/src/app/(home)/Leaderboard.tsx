"use client";
import { Spinner } from "@radix-ui/themes";
import { usePostHog } from "posthog-js/react";
import React, { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "../../trpc/react";
import { IMAGES } from "../_constants/image";
import { LeaderboardItem } from "./LeaderboardItem";

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
      },
    );
  const { featureFlags } = usePostHog();

  React.useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const leaderboardEnabled = useMemo(
    () =>
      featureFlags.isFeatureEnabled("leaderboard", {
        send_event: false,
      }),
    [featureFlags],
  );

  if (leaderboardEnabled === false) {
    return null;
  }

  return (
    <>
      {data?.pages
        ?.map(({ data: page }) =>
          page.map((item, index) => (
            <LeaderboardItem
              key={index}
              rank={index + 1}
              occImageUrl={(IMAGES.MOCK_OCC as any)[(index % 5) + 1]}
              avatarUrl={item.user.avatarUrl}
              username={item.user.displayName ?? "?"}
              shareCount={item._count.Share}
              address={item.user.Provider[0]?.value}
            />
          )),
        )
        .flat()}

      {/* Load more */}
      <div ref={ref} />

      {/* Loading */}
      {isFetching && <Spinner className="mx-auto mt-8" />}
    </>
  );
};
