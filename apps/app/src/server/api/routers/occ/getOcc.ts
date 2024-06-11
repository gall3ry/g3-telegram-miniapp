import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";

export const getOcc = protectedProcedure.query(
  async ({
    ctx: {
      session: { userId },
    },
  }) => {
    const { id: providerId } = await db.provider.findFirstOrThrow({
      where: { userId, type: "TON_WALLET" },
      orderBy: { createdAt: "desc" },
    });

    const totalReaction = await db.reaction.aggregate({
      where: {
        share: {
          Sticker: {
            GMSymbolOCC: {
              Occ: {
                providerId,
              },
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
              Occ: {
                providerId,
              },
            },
          },
        },
      },
      _count: {
        count: true,
      },
    });

    const result = await db.occ.findFirstOrThrow({
      where: {
        providerId,
      },
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
            Occ: {
              providerId,
            },
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
  },
);
