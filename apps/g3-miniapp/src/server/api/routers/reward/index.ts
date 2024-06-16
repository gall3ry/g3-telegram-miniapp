import { z } from "zod";
import { db } from "../../../db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const rewardRouter = createTRPCRouter({
  getMyRewardLogList: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx: { session }, input: { limit, cursor } }) => {
      const [items, total] = await Promise.all([
        db.rewardLogs.findMany({
          where: {
            userId: session.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          cursor: cursor ? { id: cursor } : undefined,
          take: limit,
        }),
        db.rewardLogs.count({
          where: {
            userId: session.userId,
          },
        }),
      ]);

      return {
        items,
        total,
        nextCursor: items.length < limit ? null : items[items.length - 1]!.id,
      };
    }),
});
