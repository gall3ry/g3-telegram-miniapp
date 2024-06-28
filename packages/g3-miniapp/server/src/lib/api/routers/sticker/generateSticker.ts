import { Prisma, StickerType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { env } from 'process';
import { z } from 'zod';
import { db } from '../../../db';
import { publish } from '../../services/upstash';
import { protectedProcedure } from '../../trpc';

const STICKER_TYPES_TO_CREATE: StickerType[] = ['GM1', 'GM2', 'GM3'] as const;

export const generateSticker = protectedProcedure
  .input(
    z.object({
      nfts: z.array(z.object({ nftAddress: z.string() })),
    })
  )
  .mutation(
    async ({
      input: { nfts },
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

      const data = nfts.flatMap((nft) => {
        return STICKER_TYPES_TO_CREATE.map((stickerType) => {
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
