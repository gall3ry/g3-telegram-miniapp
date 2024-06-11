// StickerTemplate

import { StickerType } from "database";
import { Sample1 } from "./Sample1";

export const mapStickerTypeToTemplateComponent = (stickerType: StickerType) => {
  switch (stickerType) {
    case StickerType.Sample1: {
      return <Sample1 />;
    }
  }
};