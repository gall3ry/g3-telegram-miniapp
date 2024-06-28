import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';

export const getGMNFTs = protectedProcedure.query(
  async ({
    ctx: {
      session: { userId },
    },
  }) => {
    const shouldShowPending = await db.gMSymbolOCC.findFirst({
      where: {
        Occ: {
          Provider: {
            userId,
          },
        },
        nftLastUpdatedAt: {
          equals: null,
        },
      },
    });

    if (shouldShowPending) {
      return {
        state: 'pending',
      };
    }

    // Refetch if last update was more than 3 minutes ago
    await db.gMSymbolOCC.updateMany({
      data: {
        nftLastUpdatedAt: null,
      },
      where: {
        Occ: {
          Provider: {
            userId: userId,
          },
        },
        nftLastUpdatedAt: {
          lt: new Date(Date.now() - 3 * 60 * 1000),
        },
      },
    });

    return {
      state: 'success',
      result: await db.gMNFT.findMany({
        where: {
          GMSymbolOCC: {
            Occ: {
              Provider: {
                userId,
              },
            },
          },
        },
        include: {
          _count: {
            select: {
              Sticker: true,
            },
          },
        },
      }),
    };
  }
);
