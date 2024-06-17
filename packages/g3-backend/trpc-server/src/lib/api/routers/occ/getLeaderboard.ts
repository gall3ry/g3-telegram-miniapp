import { IMAGES } from '@gall3ry/shared-constants';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';

type LeaderboardItemType = {
  shareCount: number;
  id: number;
  userId: number;
  displayName: string;
  avatarUrl: string;
  address: string;
};

export class LeaderboardService {
  // singleton
  private static instance: LeaderboardService;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }

    return LeaderboardService.instance;
  }

  public async getLeaderboard(): Promise<{
    data: LeaderboardItemType[];
    total: number;
  }> {
    const mockData = [
      {
        displayName: 'Jun_Gall3ry',
        shareCount: 2213,
        id: 1,
        userId: 1,
        address: 'UQBIUXf9B4qfK2TobZ437S6i-YOGm-EKkzp1fTgAPBmL_Swd',
        avatarUrl: IMAGES.MOCK_AVATAR[1],
      },
      {
        displayName: 'PhantomBlade',
        shareCount: 2078,
        id: 2,
        userId: 2,
        address: 'UQBIUXf9B4qfK2TobZ437S6i-YOGm-EKkzp1fTgAPBmL_Swd',
        avatarUrl: IMAGES.MOCK_AVATAR[2],
      },
      {
        displayName: 'CyberWarrior',
        shareCount: 1836,
        id: 3,
        userId: 3,
        address: 'UQBIUXf9B4qfK2TobZ437S6i-YOGm-EKkzp1fTgAPBmL_Swd',
        avatarUrl: IMAGES.MOCK_AVATAR[3],
      },

      {
        displayName: 'DarkMatter',
        shareCount: 1652,
        id: 4,
        userId: 4,
        address: 'UQBIUXf9B4qfK2TobZ437S6i-YOGm-EKkzp1fTgAPBmL_Swd',
        avatarUrl: IMAGES.MOCK_AVATAR[4],
      },
      {
        displayName: 'FrostBite',
        shareCount: 1512,
        id: 5,
        userId: 5,
        address: 'UQBIUXf9B4qfK2TobZ437S6i-YOGm-EKkzp1fTgAPBmL_Swd',
        avatarUrl: IMAGES.MOCK_AVATAR[5],
      },
    ];

    return {
      data: mockData,
      total: mockData.length,
    };

    // return callOrGetFromCache(Key.LEADERBOARD, async () => {
    //   const sortByShareCount = await db.$queryRaw<
    //     {
    //       id: number;
    //       shareCount: bigint;
    //       userId: number;
    //       displayName: string;
    //       avatarUrl: string;
    //       address: string;
    //     }[]
    //   >`
    //         SELECT
    //           "Sticker".id,
    //           COUNT("Share".id) as "shareCount",
    //           "User".id as "userId",
    //           "User"."displayName" as "displayName",
    //           "User"."avatarUrl" as "avatarUrl",
    //           "Provider"."value" as "address"
    //         FROM "Sticker"
    //         JOIN "Share" ON "Sticker".id = "Share"."stickerId"
    //         JOIN "GMSymbolOCC" ON "Sticker"."gMSymbolOCCId" = "GMSymbolOCC".id
    //         JOIN "Occ" ON "GMSymbolOCC"."occId" = "Occ".id
    //         JOIN "Provider" ON "Occ"."providerId" = "Provider".id
    //         JOIN "User" ON "Provider"."userId" = "User".id
    //         WHERE "Provider"."value" IS NOT NULL AND "Provider"."type" = ${ProviderType.TON_WALLET}::"ProviderType"
    //         GROUP BY "Sticker".id, "User".id, "Provider"."value"
    //         ORDER BY "shareCount" DESC`;

    //   return {
    //     data: sortByShareCount.map((item) => ({
    //       ...item,
    //       // map from bigint to number
    //       shareCount: Number(item.shareCount),
    //     })),
    //     total: sortByShareCount.length,
    //   };
    // });
  }

  public async getMyCurrentLeaderboardPosition({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId,
  }: {
    userId: number;
  }): Promise<{
    item: LeaderboardItemType;
    rank: number;
    occImageUrl: string;
  }> {
    const leaderboard = await this.getLeaderboard();

    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      item: leaderboard.data[0]!,
      rank: 1,
      occImageUrl: IMAGES.MOCK_OCC[1],
    };

    // const rank = leaderboard.data.findIndex((occ) => occ.userId === userId);

    // if (rank === -1) {
    //   throw new TRPCError({
    //     code: "NOT_FOUND",
    //     message: "User not found",
    //   });
    // }

    // const item = leaderboard.data[rank]!;
    // const address = item.address;

    // if (!address) {
    //   throw new TRPCError({
    //     code: "NOT_FOUND",
    //     message: "User does not have a TON address",
    //   });
    // }

    // return {
    //   occId: item.id,
    //   avatarUrl: item.avatarUrl,
    //   occImageUrl: "",
    //   rank: rank + 1,
    //   shareCount: item.shareCount,
    //   username: item.displayName,
    //   address,
    // };
  }
}

export const getLeaderboard = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).default(10),
      cursor: z.number().nullish(),
    })
  )
  .query(async ({ input: { limit, cursor } }) => {
    const { data: result, total } =
      await LeaderboardService.getInstance().getLeaderboard();

    // pagination
    const start = cursor ?? 0;
    const end = start + limit;

    return {
      data: result.slice(start, end),
      total: total,
      nextCursor: end,
    };
  });
