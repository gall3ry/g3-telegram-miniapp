import { IMAGES } from "../_constants/image";
import { Sample1 } from "./_components/_templates/Sample1";

export const LeaderboardAvatar = ({
  rank,
  occId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  occImageUrl,
}: {
  rank: number;
  occId: number;
  occImageUrl: string;
}) => {
  return (
    <div className="relative">
      <div className="z-0 ml-2 mt-2 aspect-square h-28 w-28 rounded-xl">
        <Sample1
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          imageUrl={IMAGES.MOCK_OCC[(occId % 5) + 1]}
          stickerTitle={`STICKER #${occId}`}
        />
      </div>

      <div className="absolute top-0 z-10 flex h-8 min-w-8 items-center justify-center rounded-lg border-4 border-white bg-[#14DB60] px-0.5 text-center text-xl font-bold leading-7 text-slate-900">
        {rank}
      </div>

      {/* <Link href={`/stickers/${occId}`}>
        <Avatar
          fallback="?"
          className="ml-2 mt-2 aspect-square h-28 w-28 rounded-xl bg-contain"
          src={occImageUrl}
          alt="occ"
        />
      </Link> */}
    </div>
  );
};
