import { StickerType } from '@gall3ry/database-client';
import { stickerTypeRecord } from '@gall3ry/g3-miniapp-sticker-templates-constants';
import { Suspense } from 'react';
import { z } from 'zod';
import { GM1 } from './GM1';
import { GM2 } from './GM2';
import { GM3 } from './GM3';

export function mapStickerTypeToTemplateComponent<T extends StickerType>(
  stickerType: T,
  _props: z.infer<(typeof stickerTypeRecord)[T]>
) {
  const { data: props, success } =
    stickerTypeRecord[stickerType].safeParse(_props);

  if (!success) {
    return null;
  }

  return (
    <Suspense>
      {(() => {
        switch (props.type) {
          case StickerType.GM1: {
            return <GM1 {...props} />;
          }
          case StickerType.GM2: {
            return <GM2 {...props} />;
          }
          case StickerType.GM3: {
            return <GM3 {...props} />;
          }
          case StickerType.GM4: {
            return <GM1 {...props} />;
          }
          default: {
            return null;
          }
        }
      })()}
    </Suspense>
  );
}
