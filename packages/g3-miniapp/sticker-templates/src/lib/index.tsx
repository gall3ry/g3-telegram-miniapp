import { StickerType } from '@gall3ry/database-client';
import { stickerTypeRecord } from '@gall3ry/g3-miniapp-sticker-templates-constants';
import { z } from 'zod';
import { GM5 } from './GM5';
import { Sample1 } from './Sample1';

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
