'use client';
import { mapStickerTypeToTemplateComponent } from '@gall3ry/g3-miniapp-sticker-templates';
import { RouterOutputs } from '@gall3ry/g3-miniapp-trpc-client';
import { Text } from '@radix-ui/themes';

export const TemplateInfo = ({
  shouldRecord = false,
  sticker,
}: {
  shouldRecord?: boolean;
  sticker: NonNullable<RouterOutputs['sticker']['getSticker']>;
}) => {
  const renderSticker = (item: NonNullable<typeof sticker>) => {
    if (!item.GMNFT.imageUrl) {
      return (
        <Text color="gray" size="2">
          Sticker error
        </Text>
      );
    }

    switch (item.stickerType) {
      case 'GM5': {
        return mapStickerTypeToTemplateComponent(item.stickerType, {
          imageUrl: item.GMNFT.imageUrl,
          shouldRecord: shouldRecord,
          type: item.stickerType,
        });
      }
      case 'Sample1': {
        return mapStickerTypeToTemplateComponent(item.stickerType, {
          imageUrl: item.GMNFT.imageUrl,
          shouldRecord: shouldRecord,
          stickerTitle: `STICKER #${item.id}`,
          type: item.stickerType,
        });
      }
      default: {
        return null;
      }
    }
  };

  return <div>{sticker ? renderSticker(sticker) : null}</div>;
};
