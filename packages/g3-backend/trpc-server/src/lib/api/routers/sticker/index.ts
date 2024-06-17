import { type Prisma, StickerType } from '@gall3ry/shared/database-client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '../../../db';
import { env } from '../../../env';
import { publish } from '../../services/upstash';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc';

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

  generateSticker: protectedProcedure
    .input(
      z.object({
        nfts: z.array(
          z.object({ imageUrl: z.string(), nftAddress: z.string() })
        ),
      })
    )
    .mutation(
      async ({
        input: { nfts: _nfts },
        ctx: {
          session: { userId },
        },
      }) => {
        const gmSymbolOCCId = await db.gMSymbolOCC.findFirst({
          where: {
            Occ: {
              Provider: {
                userId,
              },
            },
          },
        });

        if (!gmSymbolOCCId) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'GM Symbol OCC not found',
          });
        }

        // delete all existing nfts not including in nfts
        await db.gMNFT.deleteMany({
          where: {
            gMSymbolOCCId: gmSymbolOCCId.id,
            nftAddress: {
              notIn: _nfts.map((nft) => nft.nftAddress),
            },
          },
        });

        await db.gMNFT.createManyAndReturn({
          data: _nfts.map((nft) => ({
            gMSymbolOCCId: gmSymbolOCCId.id,
            nftAddress: nft.nftAddress,
            imageUrl: nft.imageUrl,
          })),
          skipDuplicates: true,
        });

        const nfts = await db.gMNFT.findMany({
          where: {
            gMSymbolOCCId: gmSymbolOCCId.id,
          },
        });

        const data = nfts.flatMap((nft) => {
          return Object.values(StickerType).map((stickerType) => ({
            nftAddress: nft.nftAddress,
            stickerType: stickerType,
            gMSymbolOCCId: gmSymbolOCCId.id,
          }));
        });

        const stickers = await db.sticker.createManyAndReturn({
          data: data satisfies Prisma.StickerCreateManyInput[],
          skipDuplicates: true,
        });

        if (env.NEXT_PUBLIC_G3_ENV !== 'development') {
          const urlToFetch = `${env.WORKER_PUBLIC_URL}/webhook/sticker/capture-gif`;
          // send capturing
          await publish({
            body: {
              stickerIds: stickers.map((sticker) => sticker.id),
            },
            url: urlToFetch,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }

        return {
          stickers,
        };
      }
    ),
});
