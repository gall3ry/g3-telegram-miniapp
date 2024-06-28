import { Prisma } from '@prisma/client';
import { createTRPCRouter } from '../../trpc';
import { generateSticker } from './generateSticker';
import { getGMNFTs } from './getGMNFTs';
import { getSticker } from './getSticker';
import { getStickers } from './getStickers';
import { getTopStickers } from './getTopStickers';

export const stickerIncluding = {
  GMNFT: {
    select: {
      imageUrl: true,
      templateMetadata: true,
    },
  },
  GMSymbolOCC: {
    include: {
      Occ: {
        include: {
          Provider: {
            include: {
              User: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          },
        },
      },
    },
  },
} as const satisfies Prisma.StickerInclude;

export const stickerRouter = createTRPCRouter({
  getStickers,
  getTopStickers,
  getSticker,
  getGMNFTs,
  generateSticker,
});
