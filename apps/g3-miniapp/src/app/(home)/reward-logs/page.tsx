'use client';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { mapQuestIdToTitle } from '@g3-miniapp-v2/types';
import { formatNumber } from '@g3-miniapp/utils';
import { Spinner } from '@radix-ui/themes';
import { format } from 'date-fns';
import groupBy from 'lodash.groupby';
import { Suspense, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { api } from '../../../trpc/react';
import { useIsAuthenticated } from '../../_providers/useAuth';
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
        {isSuccess &&
          Object.entries(groupByMonthYear).map(([key, logs]) => (
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

export default PageWrapper;
