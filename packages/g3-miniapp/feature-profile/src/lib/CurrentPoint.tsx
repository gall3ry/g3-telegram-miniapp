'use client';
import {
  useIsAuthenticated,
  useUser,
} from '@gall3ry/g3-miniapp-authentication';
import { IconPoints, IconTime } from '@gall3ry/g3-miniapp-icon';
import { IMAGES } from '@gall3ry/shared-constants';
import { IconButton, Spinner } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

export const CurrentPoint = memo(() => {
  const router = useRouter();
  const { isSuccess, isPending, data } = useUser();
  const { isAuthenticated } = useIsAuthenticated();

  return (
    isAuthenticated && (
      <div
        className="relative rounded-xl px-4 pb-[22px] pt-4"
        style={{
          backgroundImage: `url(${IMAGES.balance_bg2})`,
          backgroundSize: 'cover',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-base font-medium leading-normal tracking-tight text-white opacity-80">
            CURRENT POINTS
          </div>
          <IconButton
            variant="soft"
            radius="large"
            onClick={() => {
              router.push('/reward-logs');
            }}
          >
            <div className="size-5">
              <IconTime />
            </div>
          </IconButton>
        </div>

        <Spinner loading={isPending} className="text-white">
          <div className="flex items-center">
            <div className="h-10 w-10">
              <IconPoints />
            </div>
            {isSuccess && (
              <div className="ml-4 text-5xl font-bold leading-[64px] text-white">
                {Intl.NumberFormat().format(data.point)}
              </div>
            )}
            <div className="mb-4 ml-3 text-right text-2xl font-medium leading-9 tracking-tight text-white opacity-80">
              EPIC
            </div>
          </div>
        </Spinner>
      </div>
    )
  );
});

CurrentPoint.displayName = 'CurrentPoint';
