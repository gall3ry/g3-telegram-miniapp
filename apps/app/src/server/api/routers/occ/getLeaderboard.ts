import { TRPCError } from "@trpc/server";
import { ProviderType } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { callOrGetFromCache, Key } from "../../services/upstash";
import { publicProcedure } from "../../trpc";

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

  public async getLeaderboard() {
    return callOrGetFromCache(Key.LEADERBOARD, async () => {
      const sortByShareCount = await db.$queryRaw<
        {
          id: number;
          shareCount: bigint;
          totalShareCount: bigint;
          userId: number;
          displayName: string;
          avatarUrl: string;
          address: string;
        }[]
      >`
            SELECT 
              "Sticker".id,
              COUNT("Share".id) as "shareCount",
              ("Sticker"."shareCount" + COUNT("Share".id)) as "totalShareCount",
              "User".id as "userId",
              "User"."displayName" as "displayName",
              "User"."avatarUrl" as "avatarUrl",
              "Provider"."value" as "address"
            FROM "Sticker" 
            JOIN "Share" ON "Sticker".id = "Share"."stickerId" 
            JOIN "GMSymbolOCC" ON "Sticker"."gMSymbolOCCId" = "GMSymbolOCC".id 
            JOIN "Occ" ON "GMSymbolOCC"."occId" = "Occ".id 
            JOIN "Provider" ON "Occ"."providerId" = "Provider".id 
            JOIN "User" ON "Provider"."userId" = "User".id 
            WHERE "Provider"."value" IS NOT NULL AND "Provider"."type" = ${ProviderType.TON_WALLET}::"ProviderType"
            GROUP BY "Sticker".id, "User".id, "Provider"."value"
            ORDER BY "totalShareCount" DESC`;

      return {
        data: sortByShareCount.map((item) => ({
          ...item,
          // map from bigint to number
          shareCount: Number(item.shareCount),
          totalShareCount: Number(item.totalShareCount),
        })),
        total: sortByShareCount.length,
      };
    });
  }

  public async getMyCurrentLeaderboardPosition({ userId }: { userId: number }) {
    const leaderboard = await this.getLeaderboard();

    const rank = leaderboard.data.findIndex((occ) => occ.userId === userId);

    if (rank === -1) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const item = leaderboard.data[rank]!;
    const address = item.address;

    if (!address) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User does not have a TON address",
      });
    }

    return {
      occId: item.id,
      avatarUrl: item.avatarUrl,
      occImageUrl: "",
      rank: rank + 1,
      shareCount: item.totalShareCount,
      username: item.displayName,
      address,
    };
  }
}

export const getLeaderboard = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).default(10),
      cursor: z.number().nullish(),
    }),
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
