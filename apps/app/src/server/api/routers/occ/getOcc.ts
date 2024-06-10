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
          Sticker: {
            GMSymbolOCC: {
              occId: id,
            },
          },
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
          Sticker: {
            GMSymbolOCC: {
              occId: id,
            },
          },
        },
      },
      _count: {
        count: true,
      },
    });

    const result = await db.occ.findUniqueOrThrow({
      where: { id },
      include: {
        Provider: {
          select: {
            User: {
              select: {
                id: true,
                avatarUrl: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    const partnerShare = await db.share.count({
      where: {
        Sticker: {
          GMSymbolOCC: {
            occId: id,
          },
        },
      },
    });
    const shareCount = result.shareCount;
    const totalShare = partnerShare + shareCount;

    return {
      ...result,
      totalReaction: totalReaction._sum.count ?? 0,
      reactions,
      totalShare,
    };
  });
