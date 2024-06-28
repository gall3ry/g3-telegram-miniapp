import { StickerType } from '@prisma/client';
import { z } from 'zod';

export const stickerResultSchema = z.object({
  id: z.number(),
  stickerType: z.nativeEnum(StickerType),
  User: z.object({
    id: z.number(),
    username: z.string(),
  }),
  extra: z.object({
    epicSaved: z.number(),
    imageUrl: z.string().nullable(),
  }),
  templateMetadata: z.any().nullable(),
  createdAt: z.coerce.date(),
  shareCount: z.number(),
  telegramFileId: z.string().nullable(),
});
