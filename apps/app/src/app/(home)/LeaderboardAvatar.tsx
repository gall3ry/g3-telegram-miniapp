import { Avatar } from "@radix-ui/themes";
import Link from "next/link";

export const LeaderboardAvatar = ({
  rank,
  occId,
  occImageUrl,
}: {
  rank: number;
  occId: number;
  occImageUrl: string;
}) => {
  return (
    <div className="relative">
      <div className="absolute flex h-8 min-w-8 items-center justify-center rounded-lg border-4 border-white bg-[#14DB60] px-0.5 text-center text-xl font-bold leading-7 text-slate-900">
        {rank}
      </div>

      <Link href={`/occ/${occId}`}>
        <Avatar
          fallback="?"
          className="ml-2 mt-2 aspect-square h-28 w-28 rounded-xl bg-contain"
          src={occImageUrl}
          alt="occ"
        />
      </Link>
    </div>
  );
};
