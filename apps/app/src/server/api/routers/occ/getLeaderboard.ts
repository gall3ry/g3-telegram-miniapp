import { z } from "zod";
import { db } from "../../../db";
import { publicProcedure } from "../../trpc";

export const getLeaderboard = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).default(10),
      cursor: z.number().nullish(),
    }),
  )
  .query(async ({ input: { limit, cursor } }) => {
    const result = await db.occ.findMany({
      include: {
        _count: {
          select: {
            Share: true,
          },
        },
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
            Provider: {
              where: {
                type: "TON_WALLET",
              },
            },
          },
        },
      },
    });

    const sortByShareCount = result.sort(
      (a, b) => b.shareCount + b._count.Share - (a.shareCount + a._count.Share),
    );

    // pagination
    const start = cursor ?? 0;
    const end = start + limit;

    return {
      data: sortByShareCount.slice(start, end),
      total: sortByShareCount.length,
      nextCursor: end,
    };
  });
