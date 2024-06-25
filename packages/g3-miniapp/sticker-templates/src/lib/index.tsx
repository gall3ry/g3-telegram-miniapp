import { StickerType } from '@gall3ry/database-client';
import { z } from 'zod';
import { GM5 } from './GM5';
import { Sample1 } from './Sample1';

const stickerTypeRecord = {
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

export function mapStickerTypeToTemplateComponent<T extends StickerType>(
  stickerType: T,
  _props: z.infer<(typeof stickerTypeRecord)[T]>
) {
  const props = stickerTypeRecord[stickerType].parse(_props);

  switch (props.type) {
    case StickerType.Sample1: {
      return <Sample1 {...props} />;
    }
    case StickerType.GM5: {
      return <GM5 {...props} />;
    }
    default: {
      return null;
    }
  }
}
