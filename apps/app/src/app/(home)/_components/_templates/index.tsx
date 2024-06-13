// StickerTemplate

import { StickerType } from "database";
import { type ComponentProps } from "react";
import { Sample1 } from "./Sample1";

export const mapStickerTypeToTemplateComponent = (
  stickerType: StickerType,
  props: ComponentProps<typeof Sample1>,
) => {
  switch (stickerType) {
    case StickerType.Sample1: {
      return <Sample1 {...props} />;
    }
  }
  return null;
};
