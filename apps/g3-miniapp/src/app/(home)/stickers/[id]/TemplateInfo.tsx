'use client';
import { mapStickerTypeToTemplateComponent } from '@gall3ry/g3-miniapp-sticker-templates';
import { useParams } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { z } from 'zod';
import { api } from '../../../../trpc/react';
import styles from './TemplateInfo.module.scss';

export const TemplateInfo = () => {
  const [shouldRecord] = useQueryState(
    'record',
    parseAsBoolean.withDefault(false)
  );
  const _params = useParams<{ id: string }>();
  const id = z.coerce.number().finite().parse(_params.id);
  const { data: sticker } = api.sticker.getSticker.useQuery(
    {
      id: id,
    },
    {
      enabled: isFinite(id),
    }
  );

  return (
    <div className={styles.swiper}>
      {sticker?.GMNFT.imageUrl &&
        mapStickerTypeToTemplateComponent(sticker.stickerType, {
          imageUrl: sticker.GMNFT.imageUrl,
          shouldRecord: shouldRecord,
          stickerTitle: `STICKER #${sticker.id}`,
        })}

      <div className="mt-4 text-center text-4xl font-bold leading-[44px] text-slate-900">
        #GM{id}
      </div>
    </div>
  );
};
