import { z } from 'zod';
import { db } from '../../../db';
import { publicProcedure } from '../../trpc';
import { stickerIncluding } from './index';
import { stickerResultSchema } from './stickerResultSchema';

export const getSticker = publicProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .output(stickerResultSchema)
  .query(async ({ input: { id } }) => {
    const result = await db.sticker.findFirstOrThrow({
      include: stickerIncluding,
      where: {
        id,
      },
    });

    const user = result.GMSymbolOCC.Occ.Provider.User;
    delete result.GMSymbolOCC.Occ.Provider.User;

    const extra = {
      // TODO:  Make this
      epicSaved: 0,
    } as const;

    return {
      id: result.id,
      stickerType: result.stickerType,
      extra,
      User: {
        id: user.id,
        username: user.displayName,
      },
      templateMetadata: result.GMNFT.templateMetadata,
      shareCount: result.shareCount,
      telegramFileId: result.telegramFileId,
      createdAt: result.createdAt,
    } satisfies z.infer<typeof stickerResultSchema>;
  });
