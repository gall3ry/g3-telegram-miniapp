import { Prisma, StickerType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { env } from 'process';
import { z } from 'zod';
import { db } from '../../../db';
import { publish } from '../../services/upstash';
import { protectedProcedure } from '../../trpc';

export const generateSticker = protectedProcedure
  .input(
    z.object({
      nfts: z.array(z.object({ imageUrl: z.string(), nftAddress: z.string() })),
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
        return Object.values(StickerType).map((stickerType) => {
          switch (stickerType) {
            case 'GM5':
            default: {
              return {
                nftAddress: nft.nftAddress,
                stickerType: stickerType,
                gMSymbolOCCId: gmSymbolOCCId.id,
              };
            }
          }
        });
      }) satisfies Prisma.StickerCreateManyInput[];

      const stickers = await db.sticker.createManyAndReturn({
        data: data,
        skipDuplicates: true,
      });

      if (stickers.length > 0) {
        const urlToFetch = `${env.CAPTURING_WORKER_PUBLIC_URL}/api/webhook/sticker/capture-gif`;
        // send capturing

        await publish({
          body: {
            stickerIds: stickers.map((sticker) => sticker.id),
          },
          url: urlToFetch,
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch((e) => {
          console.error('Error sending to worker', e);
        });
      }

      return {
        stickers,
      };
    }
  );
