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

export enum QuestId {
  JOIN_COMMUNITY = "JOIN_COMMUNITY",
  BIND_WALLET_ADDRESS = "BIND_WALLET_ADDRESS",
  MINT_GM_EPIC_QUEST = "MINT_GM_EPIC_QUEST",
  POINT_RECEIVED_FROM_FRIEND = "POINT_RECEIVED_FROM_FRIEND",
  SHARING_FRIEND_STICKER = "SHARING_FRIEND_STICKER",
  SHARING_MY_STICKER = "SHARING_MY_STICKER",
}

export const mapQuestIdToTitle: Record<QuestId, string> = {
  [QuestId.JOIN_COMMUNITY]: "Join Community",
  [QuestId.BIND_WALLET_ADDRESS]: "Bind Wallet Address",
  [QuestId.MINT_GM_EPIC_QUEST]: "Mint GM Epic Quest",

  // Quest is added from server-side
  [QuestId.POINT_RECEIVED_FROM_FRIEND]: "Point Received From Friend",
  [QuestId.SHARING_FRIEND_STICKER]: "Sharing Friend Sticker",
  [QuestId.SHARING_MY_STICKER]: "Sharing My Sticker",
};
