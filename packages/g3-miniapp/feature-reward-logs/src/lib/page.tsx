'use client';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { formatNumber } from '@g3-miniapp/utils';
import { useIsAuthenticated } from '@gall3ry/g3-miniapp-authentication';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { IMAGES } from '@gall3ry/shared-constants';
import { mapQuestIdToTitle } from '@gall3ry/types';
import { Button, Spinner } from '@radix-ui/themes';
import { format } from 'date-fns';
import groupBy from 'lodash.groupby';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { IconTime } from './_icon/IconTime';

const Page = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const LIMIT = 10;
  const [ref, inView] = useInView({
    threshold: 0,
  });
  const [parent] = useAutoAnimate();
  const { data, isSuccess, fetchNextPage, isFetching } =
    api.reward.getMyRewardLogList.useInfiniteQuery(
      { limit: LIMIT },
      {
        enabled: isAuthenticated,
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    );
  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const groupByMonthYear = useMemo(() => {
    if (!isSuccess) return {};
    const _data = data?.pages.flatMap((page) => page.items) ?? [];

    // JUN 2024
    const result = groupBy(_data, (item) =>
      format(item.createdAt, 'MMM yyyy').toUpperCase()
    );

    return result;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div>
      <div className="text-xl font-bold leading-7 text-slate-900">
        Point history
      </div>

      <div className="mt-4" ref={parent}>
        {isSuccess && (
          <>
            {Object.keys(groupByMonthYear).length === 0 && (
              <div className="flex flex-col items-center">
                <Image
                  src={IMAGES.no_items}
                  width={200}
                  height={176}
                  alt="No items"
                />

                <div className="text-center text-slate-900 text-2xl font-bold leading-9">
                  No history
                </div>
                <div className="text-center text-slate-500 text-base font-light leading-normal tracking-tight">
                  Let’s create EPIC and get $EPIC 😉
                </div>

                <div className="mt-6">
                  <Button size="4" asChild>
                    <Link href="/quests">Learn more</Link>
                  </Button>
                </div>
              </div>
            )}

            {Object.entries(groupByMonthYear).map(([key, logs]) => (
              <div key={key}>
                <div className="flex h-7 items-center justify-start gap-2 pb-1">
                  <div className="h-3 w-3 rounded-full bg-[#14DB60]" />
                  <div className="text-center text-base font-medium leading-normal tracking-tight text-[#717D00]">
                    {key}
                  </div>
                  <div className="h-[3px] shrink grow basis-0 rounded-xl bg-[#14DB60]" />
                </div>

                {logs.map((log) => (
                  <div className="py-2" key={log.id}>
                    <div className="flex justify-between">
                      <div className="w-[273px] text-base font-medium leading-normal tracking-tight text-slate-900">
                        {!!log.taskId &&
                          mapQuestIdToTitle[
                            log.taskId as unknown as keyof typeof mapQuestIdToTitle
                          ]}
                      </div>

                      <div className="text-right text-xl font-bold leading-7 text-[#BACF00]">
                        {log.point > 0
                          ? `+${formatNumber(log.point)}`
                          : `${formatNumber(log.point)}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="size-4">
                        <IconTime />
                      </div>

                      <div className="text-sm font-light leading-tight tracking-tight text-slate-500">
                        {format(log.createdAt, 'd MMM, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Load more */}
      <div ref={ref} />

      {/* Loading */}
      {isFetching && <Spinner className="mx-auto mt-8" />}
    </div>
  );
};

const PageWrapper = () => {
  return (
    <Suspense fallback={<Spinner mx="auto" />}>
      <Page />
    </Suspense>
  );
};

export { PageWrapper as Page };
