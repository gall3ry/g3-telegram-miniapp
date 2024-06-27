import { StickerType } from '@gall3ry/database-client';
import { z } from 'zod';

export const stickerTypeRecord = {
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
