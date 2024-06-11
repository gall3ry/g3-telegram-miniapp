import { StickerType } from "database";

export type StickerTemplate = {
  title: string;
  description: string;
  messageText: string;
};

export const mapStickerTypeToStickerTemplate: Record<
  StickerType,
  StickerTemplate
> = {
  Sample1: {
    title: "Rainy GM",
    description: "We use this sticker to greet good morning when it's raining",
    messageText: "Good morning",
  },
};
