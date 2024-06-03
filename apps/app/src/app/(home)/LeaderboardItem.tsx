"use client";

export const LeaderboardItem = ({
  rank,
  occImageUrl,
  avatarUrl,
  username,
  shareCount,
}: {
  rank: number;
  occImageUrl: string;
  avatarUrl: string;
  username: string;
  shareCount: number;
}) => {
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="absolute flex h-8 w-8 items-center justify-center rounded-lg border-4 border-white bg-[#DAF200] text-center text-xl font-bold leading-7 text-slate-900">
          {rank}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ml-2 mt-2 aspect-square h-28 w-28 rounded-xl bg-contain"
          src={occImageUrl}
          alt="occ"
        />
      </div>

      <div>
        <div className="text-sm font-medium leading-tight tracking-tight text-slate-900">
          Created by
        </div>

        <div className="mt-2">
          <div className="relative flex h-8 w-8 items-center gap-2.5 rounded-lg bg-pink-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="h-8 w-8 rounded-lg" src={avatarUrl} alt="avatar" />

            <div>
              <div className="text-base font-bold leading-normal text-slate-900">
                {username}
              </div>
              <div className="text-xs font-light leading-[18px] tracking-tight text-slate-500">
                UQCm1Y...-RKzXd
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1">
          <div className="inline-flex h-11 items-end justify-start gap-1.5">
            <div className="text-4xl font-bold text-[#BACF00]">
              {Intl.NumberFormat().format(shareCount)}
            </div>
            <div className="text-sm font-medium leading-tight tracking-tight text-slate-900">
              shares
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
