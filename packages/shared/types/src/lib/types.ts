import { StickerType } from '@gall3ry/database-client';

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
    title: 'Sample1',
    description: 'We use this sticker to greet good morning',
    messageText: 'GM fam!',
  },
  GM5: {
    title: 'GM5',
    description: 'We use this sticker to greet good morning',
    messageText: 'GM fam!',
  },
  GM1: {
    title: 'GM1',
    description: 'We use this sticker to greet good morning',
    messageText: 'GM fam!',
  },
  GM2: {
    title: 'GM2',
    description: 'We use this sticker to greet good morning',
    messageText: 'GM fam!',
  },
  GM3: {
    title: 'GM3',
    description: 'We use this sticker to greet good morning',
    messageText: 'GM fam!',
  },
  GM4: {
    title: 'GM4',
    description: 'We use this sticker to greet good morning',
    messageText: 'GM fam!',
  },
};

export enum QuestId {
  JOIN_COMMUNITY = 'JOIN_COMMUNITY',
  BIND_WALLET_ADDRESS = 'BIND_WALLET_ADDRESS',
  MINT_GM_EPIC_QUEST = 'MINT_GM_EPIC_QUEST',
  POINT_RECEIVED_FROM_FRIEND = 'POINT_RECEIVED_FROM_FRIEND',
  SHARING_FRIEND_STICKER = 'SHARING_FRIEND_STICKER',
  SHARING_MY_STICKER = 'SHARING_MY_STICKER',
  MINT_OCC_BY_EPIC_POINT = 'MINT_OCC_BY_EPIC_POINT',
}

export const mapQuestIdToTitle: Record<QuestId, string> = {
  [QuestId.JOIN_COMMUNITY]: 'Join Community',
  [QuestId.BIND_WALLET_ADDRESS]: 'Bind Wallet Address',
  [QuestId.MINT_GM_EPIC_QUEST]: 'Mint GM Epic Quest',
  [QuestId.MINT_OCC_BY_EPIC_POINT]: 'Mint OCC By Epic Point',

  // Quest is added from server-side
  [QuestId.POINT_RECEIVED_FROM_FRIEND]: 'Point Received From Friend',
  [QuestId.SHARING_FRIEND_STICKER]: 'Sharing Friend Sticker',
  [QuestId.SHARING_MY_STICKER]: 'Sharing My Sticker',
};

export enum OccType {
  GMSymbolOCC = 'GMSymbolOCC',
}
