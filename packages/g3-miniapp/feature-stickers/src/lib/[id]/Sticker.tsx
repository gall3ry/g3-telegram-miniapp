'use client';
import { mapStickerTypeToTemplateComponent } from '@gall3ry/g3-miniapp-sticker-templates';
import { stickerTypeRecord } from '@gall3ry/g3-miniapp-sticker-templates-constants';
import { RouterOutputs } from '@gall3ry/g3-miniapp-trpc-client';
import { Spinner, Text } from '@radix-ui/themes';
import { memo } from 'react';
import { z } from 'zod';

export const Sticker = memo(
  ({
    shouldRecord = false,
    sticker,
    loadingIndicator = false,
  }: {
    shouldRecord?: boolean;
    sticker: NonNullable<RouterOutputs['sticker']['getSticker']>;
    loadingIndicator?: boolean;
  }) => {
    const isReady = !!sticker?.telegramFileId;

    const renderSticker = (item: NonNullable<typeof sticker>) => {
      switch (item.stickerType) {
        case 'GM1': {
          const { data, error } = stickerTypeRecord[item.stickerType].safeParse(
            {
              imageUrl: item.extra.imageUrl,
              type: item.stickerType,
              shouldRecord: shouldRecord,
            } as z.input<(typeof stickerTypeRecord)['GM1']>
          );

          if (error) {
            console.error(error);
            return null;
          }

          return mapStickerTypeToTemplateComponent(item.stickerType, data);
        }
        case 'GM2': {
          const metadata = sticker.templateMetadata;

          const { data, error } = stickerTypeRecord[item.stickerType].safeParse(
            {
              imageUrl: item.extra.imageUrl,
              shouldRecord: shouldRecord,
              type: item.stickerType,

              epicSaved: item.extra.epicSaved,
              ownerName: item.User.username,

              stickerCreatedDate: item.createdAt,
              stickerId: item.id,

              nftName: (metadata as any)?.nftName,
              price: (metadata as any)?.price,

              nftId: (metadata as any)?.nftId,
            } as z.input<(typeof stickerTypeRecord)['GM2']>
          );

          if (error) {
            console.error(error.issues);
            return null;
          }

          return mapStickerTypeToTemplateComponent(item.stickerType, data);
        }
        case 'GM3': {
          const { data, error } = stickerTypeRecord[item.stickerType].safeParse(
            {
              imageUrl: item.extra.imageUrl,
              shouldRecord: shouldRecord,
              type: item.stickerType,
            } as z.input<(typeof stickerTypeRecord)['GM3']>
          );

          if (error) {
            console.error(error);
            return null;
          }

          return mapStickerTypeToTemplateComponent(item.stickerType, data);
        }
        case 'GM4': {
          const { data, error } = stickerTypeRecord[item.stickerType].safeParse(
            {
              imageUrl: item.extra.imageUrl,
              shouldRecord: shouldRecord,
              type: item.stickerType,
            } as z.input<(typeof stickerTypeRecord)['GM4']>
          );

          if (error) {
            console.error(error);
            return null;
          }

          return mapStickerTypeToTemplateComponent(item.stickerType, data);
        }
        case 'GM5': {
          const { data, error } = stickerTypeRecord[item.stickerType].safeParse(
            {
              imageUrl: item.extra.imageUrl,
              shouldRecord: shouldRecord,
              type: item.stickerType,
            } as z.input<(typeof stickerTypeRecord)['GM5']>
          );

          if (error) {
            console.error(error);
            return null;
          }

          return mapStickerTypeToTemplateComponent(item.stickerType, data);
        }
        case 'Sample1': {
          const { data, error } = stickerTypeRecord[item.stickerType].safeParse(
            {
              imageUrl: item.extra.imageUrl,
              shouldRecord: shouldRecord,
              type: item.stickerType,
            } as z.input<(typeof stickerTypeRecord)['Sample1']>
          );

          if (error) {
            console.error(error);
            return null;
          }

          return mapStickerTypeToTemplateComponent(item.stickerType, data);
        }
        default: {
          return null;
        }
      }
    };

    return (
      <div className="relative aspect-square">
        {sticker ? renderSticker(sticker) : null}

        {!isReady && loadingIndicator && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center gap-2">
            <Spinner />
            <Text color="gray">Loading...</Text>
          </div>
        )}
      </div>
    );
  }
);

Sticker.displayName = 'Sticker';
