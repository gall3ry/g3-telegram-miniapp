'use client';
import { IMAGES } from '@gall3ry/shared-constants';
import { Flex, Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import { memo } from 'react';
import { useIsAuthenticated } from '../../_providers/useAuth';
import { CurrentPoint } from '../quests/CurrentPoint';

export const Top = memo(() => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  return (
    <div>
      {isAuthenticated ? (
        <Spinner loading={isLoading}>
          <CurrentPoint />
        </Spinner>
      ) : (
        <Flex direction="column">
          <div className="z-10">
            <div className="mt-8 flex flex-col items-center">
              <div className="flex h-12 items-center justify-start gap-3">
                <div className="h-4 w-4 rounded-full bg-[#14DB60]" />
                <div className="text-center text-4xl font-bold leading-[48px] text-slate-900">
                  Create your EPIC
                </div>
              </div>
              <div className="flex h-12 items-center justify-start gap-3">
                <div className="h-4 w-4 rounded-full bg-[#14DB60]" />
                <div className="text-center text-4xl font-bold leading-[48px] text-slate-900">
                  And get $EPIC
                </div>
              </div>
            </div>
          </div>
        </Flex>
      )}

      <div className="mt-6">
        <div className="text-center text-xl font-bold leading-7 text-slate-900">
          Hall of EPICs
        </div>
      </div>

      <div className="my-4">
        <div className="relative h-[120px] rounded-xl bg-[#87FFB5] px-5 py-2.5">
          <div className="text-4xl font-bold leading-[44px] text-slate-900">
            1,000 $TON
          </div>
          <div className="text-base font-medium leading-normal tracking-tight text-slate-900">
            FOR THE CHAMPIONS
          </div>
          <div className="inline-flex items-center justify-start gap-1.5">
            <div className="h-2 w-2 rounded-full bg-lime-700" />
            <div className="text-xs font-medium leading-[18px] tracking-tight text-[#005320]">
              The leaders take it all
            </div>
          </div>

          <Image
            src={IMAGES.banner_right_image}
            alt="banner_right_image"
            width={117}
            height={106}
            className="absolute bottom-1.5 right-[14px]"
          />
        </div>
      </div>
    </div>
  );
});

Top.displayName = 'Top';
