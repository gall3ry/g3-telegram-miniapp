import { z } from "zod";
import { db } from "../../../db";
import { publicProcedure } from "../../trpc";

export const getOcc = publicProcedure
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .query(async ({ input: { id } }) => {
    const totalReaction = await db.reaction.aggregate({
      where: {
        share: {
          occId: id,
        },
      },
      _sum: {
        count: true,
      },
    });

    const reactions = await db.reaction.groupBy({
      by: ["unifiedCode"],
      where: {
        share: {
          occId: id,
        },
      },
      _count: {
        count: true,
      },
    });

    const result = await db.occ.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            avatarUrl: true,
            displayName: true,
          },
        },

        _count: {
          select: {
            Share: true,
          },
        },
      },
    });

    return {
      ...result,
      totalReaction: totalReaction._sum.count ?? 0,
      reactions,
    };
  });
