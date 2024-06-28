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
      items: items.map(({ stickerType, id, ...sticker }) => ({
        id: id,
        type: stickerType,
        extra: {
          epicSaved: 0,
        },
        User: {
          id: sticker.GMSymbolOCC.Occ.Provider.User.id,
          username: sticker.GMSymbolOCC.Occ.Provider.User.displayName,
        },
      })),
      total,
    };
  });
