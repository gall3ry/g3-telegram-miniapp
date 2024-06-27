import { type Prisma } from '@gall3ry/database-client';
import { env } from '@gall3ry/g3-miniapp-env';
import { ErrorMessage } from '@gall3ry/types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '../../../db';
import { getMessageId, publish } from '../../services/upstash';
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
      const addressList = await db.provider.findMany({
        where: {
          type: 'TON_WALLET',
        },
      });

      // Make cron job for this
      const messageId = await publish({
        contentBasedDeduplication: true,
        url: `${env.CAPTURING_WORKER_PUBLIC_URL}/api/webhook/get-nfts`,
        body: {
          providerIds: addressList.map((address) => address.id),
        },
      });

      const { state } = await getMessageId(messageId);

      if (state !== 'DELIVERED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: ErrorMessage.Fetching,
        });
      }

      return db.gMNFT.findMany({
        where: {
          GMSymbolOCC: {
            Occ: {
              Provider: {
                userId,
              },
            },
          },
        },
      });
    }
  ),

  generateSticker: generateSticker,
});
