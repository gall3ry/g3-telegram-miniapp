import { z } from 'zod';
import { stickerIncluding } from '.';
import { db } from '../../../db';
import { publicProcedure } from '../../trpc';
import { stickerResultSchema } from './stickerResultSchema';

export const getTopStickers = publicProcedure
  .input(z.object({ limit: z.number() }))
  .output(z.object({ items: z.array(stickerResultSchema), total: z.number() }))
  .query(async ({ input: { limit } }) => {
    const [items, total] = await Promise.all([
      db.sticker.findMany({
        take: limit,
        include: stickerIncluding,
        orderBy: {
          shareCount: 'desc',
        },
      }),
      db.sticker.count(),
    ]);

    return {
      items: items.map(({ stickerType, id, ...sticker }) => {
        // sticker.GMSymbolOCC.Occ.Provider.User.id,
        const userId = sticker.GMSymbolOCC?.Occ.Provider.User.id;
        const username = sticker.GMSymbolOCC?.Occ.Provider.User.displayName;

        if (!userId || !username) {
          throw new Error('User not found');
        }

        return {
          id: id,
          type: stickerType,
          extra: {
            epicSaved: 0,
            imageUrl: sticker.GMNFT.imageUrl,
          },
          User: {
            id: userId,
            username: username,
          },
          createdAt: sticker.createdAt,
          shareCount: sticker.shareCount,
          stickerType,
          telegramFileId: sticker.telegramFileId,
          templateMetadata: sticker.GMNFT.templateMetadata,
        } as z.infer<typeof stickerResultSchema>;
      }),
      total,
    };
  });
