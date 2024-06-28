import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { stickerIncluding } from '.';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';
import { stickerResultSchema } from './stickerResultSchema';

export const getStickers = protectedProcedure
  .output(z.object({ items: z.array(stickerResultSchema), total: z.number() }))
  .query(
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
          include: stickerIncluding,
        }),
        db.sticker.count({
          where: where,
        }),
      ]);

      const result = {
        items: items.map(
          ({ stickerType, id, ...sticker }) =>
            ({
              id: id,
              stickerType: stickerType,
              extra: {
                epicSaved: 0,
                imageUrl: sticker.GMNFT.imageUrl,
              },
              User: {
                id: sticker.GMSymbolOCC.Occ.Provider.User.id,
                username: sticker.GMSymbolOCC.Occ.Provider.User.displayName,
              },
              templateMetadata: sticker.GMNFT.templateMetadata,
              shareCount: sticker.shareCount,
              telegramFileId: sticker.telegramFileId,
              createdAt: sticker.createdAt,
            } satisfies z.infer<typeof stickerResultSchema>)
        ),

        total,
      };

      return result;
    }
  );
