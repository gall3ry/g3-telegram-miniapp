import { Spinner } from "@radix-ui/themes";
import { api } from "../../trpc/react";
import { IMAGES } from "../_constants/image";
import { LeaderboardItem } from "./LeaderboardItem";

export const MyCurrentPosition = () => {
  const { data, isPending, isSuccess } =
    api.occ.getMyCurrentLeaderboardPosition.useQuery();

  return (
    <Spinner loading={isPending}>
      {isSuccess && (
        <div className="rounded-lg bg-[#FCFFE5] p-3">
          <div className="text-base font-bold leading-normal text-slate-900">
            Your current position:
          </div>

          <div className="mt-2">
            <LeaderboardItem
              occId={data.occId}
              avatarUrl={data.avatarUrl}
              occImageUrl={(IMAGES.MOCK_OCC as any)[data.rank % 5]}
              rank={data.rank}
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
