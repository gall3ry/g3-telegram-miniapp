import { type Prisma } from '@gall3ry/database-client';
import { z } from 'zod';
import { db } from '../../../db';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc';
import { generateSticker } from './generateSticker';

export const stickerRouter = createTRPCRouter({
  getStickers: protectedProcedure.query(
    async ({
      ctx: {
        session: { userId },
      },
    }) => {
      const where = {
        GMSymbolOCC: {
          Occ: {
            Provider: {
              userId,
            },
          },
        },
      } satisfies Prisma.StickerWhereInput;

      const [items, total] = await Promise.all([
        db.sticker.findMany({
          where: where,
          include: {
            GMNFT: {
              select: {
                imageUrl: true,
              },
            },
          },
        }),
        db.sticker.count({
          where: where,
        }),
      ]);

      return {
        items,
        total,
      };
    }
  ),

  getTopStickers: publicProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ input: { limit } }) => {
      const items = await db.sticker.findMany({
        take: limit,
        include: {
          GMNFT: {
            select: {
              imageUrl: true,
            },
          },
        },
        orderBy: {
          shareCount: 'desc',
        },
      });

      return {
        items,
      };
    }),

  getSticker: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input: { id } }) => {
      return db.sticker.findFirst({
        include: {
          GMNFT: {
            select: {
              imageUrl: true,
            },
          },
        },
        where: {
          id,
        },
      });
    }),

  getGMNFTs: protectedProcedure.query(
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
  ),

  generateSticker: generateSticker,
});
