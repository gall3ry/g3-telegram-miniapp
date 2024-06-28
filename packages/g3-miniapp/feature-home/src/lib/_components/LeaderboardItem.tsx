'use client';
import { formatTonAddress } from '@g3-miniapp/utils';
import { Avatar, Skeleton } from '@radix-ui/themes';
import { LeaderboardAvatar } from './LeaderboardAvatar';

export const LeaderboardItem = ({
  occId,
  rank,
  occImageUrl,
  avatarUrl,
  username,
  shareCount,
  address,
}: {
  occId: number;
  rank: number;
  occImageUrl: string;
  avatarUrl: string | null;
  username: string;
  shareCount: number;
  address?: string;
}) => {
  return (
    <div className="flex items-center gap-6">
      <LeaderboardAvatar rank={rank} occId={occId} occImageUrl={occImageUrl} />

      <div>
        <div className="text-sm font-medium leading-tight tracking-tight text-slate-900">
          Created by
        </div>

        <div className="mt-2">
          <div className="relative flex h-8 w-8 items-center gap-2.5 rounded-lg bg-pink-50">
            <Avatar
              fallback={username[0] ?? '?'}
              className="h-8 w-8 rounded-lg"
              src={avatarUrl ?? undefined}
              alt="avatar"
            />

            <Skeleton width="150px" height="100%" loading={!username}>
              <div className="flex flex-col">
                <div className="text-base font-bold leading-normal text-slate-900">
                  {username}
                </div>
                {address && (
                  <div className="text-xs font-light tracking-tight text-slate-500">
                    {formatTonAddress(address)}
                  </div>
                )}
              </div>
            </Skeleton>
          </div>
        </div>

        <div className="mt-1">
          <div className="inline-flex h-11 items-end justify-start gap-1.5">
            <div className="text-4xl font-bold text-[#06B94B]">
              {Intl.NumberFormat().format(shareCount)}
            </div>
            <div className="text-sm font-medium leading-tight tracking-tight text-slate-900">
              share{shareCount === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
