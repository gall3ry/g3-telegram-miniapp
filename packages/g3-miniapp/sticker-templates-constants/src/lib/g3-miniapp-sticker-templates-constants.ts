import { StickerType } from '@gall3ry/database-client';
import { z } from 'zod';

export const stickerTypeRecord = {
  GM1: z.object({
    type: z.literal(StickerType.GM1),
    shouldRecord: z.boolean().default(false),
    imageUrl: z.string(),
  }),
  GM2: z.object({
    type: z.literal(StickerType.GM2),
    shouldRecord: z.boolean().default(false),
    imageUrl: z.string(),

    nftName: z.string(),
    nftId: z.number(),
    ownerName: z.string(),
    stickerId: z.number(),
    epicSaved: z.number(),
    stickerCreatedDate: z.coerce.date(),
    price: z.string(),
  }),
  GM3: z.object({
    type: z.literal(StickerType.GM3),
    shouldRecord: z.boolean().default(false),
    imageUrl: z.string(),
  }),
  GM4: z.object({
    type: z.literal(StickerType.GM4),
    shouldRecord: z.boolean().default(false),
    imageUrl: z.string(),
  }),

  // @deprecated
  GM5: z.object({
    type: z.literal(StickerType.GM5), // must be the same as the key
    shouldRecord: z.boolean().default(false),
    imageUrl: z.string(),
  }),
  Sample1: z.object({
    type: z.literal(StickerType.Sample1),
    shouldRecord: z.boolean().default(false),
    imageUrl: z.string(),
    stickerTitle: z.string(),
  }),
} as const satisfies Record<StickerType, z.AnyZodObject>;
