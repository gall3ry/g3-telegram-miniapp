import { TRPCError } from "@trpc/server";
import { Prisma, StickerType } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const stickerRouter = createTRPCRouter({
  getStickers: protectedProcedure.query(
    async ({
      ctx: {
        session: { userId },
      },
    }) => {
      return db.sticker.findMany({
        where: {
          GMSymbolOCC: {
            Occ: {
              Provider: {
                userId,
              },
            },
          },
        },
      });
    },
  ),

  getGMNFTs: protectedProcedure.query(
    async ({
      ctx: {
        session: { userId },
      },
    }) => {
      return db.gMNFT.findMany({
        where: {
          GMSymbolOCC: {
            Occ: {
              Provider: {
                userId,
              },
            },
          },
        },
      });
    },
  ),

  generateSticker: protectedProcedure
    .input(
      z.object({
        nfts: z.array(
          z.object({ imageUrl: z.string(), nftAddress: z.string() }),
        ),

        occId: z.number(),
      }),
    )
    .mutation(async ({ input: { nfts: _nfts, occId } }) => {
      const gmSymbolOCCId = await db.gMSymbolOCC.findFirst({
        where: {
          occId,
        },
      });

      if (!gmSymbolOCCId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "GM Symbol OCC not found",
        });
      }

      // delete all existing nfts not including in nfts
      await db.gMNFT.deleteMany({
        where: {
          gMSymbolOCCId: gmSymbolOCCId.id,
          nftAddress: {
            notIn: _nfts.map((nft) => nft.nftAddress),
          },
        },
      });

      await db.gMNFT.createManyAndReturn({
        data: _nfts.map((nft) => ({
          gMSymbolOCCId: gmSymbolOCCId.id,
          nftAddress: nft.nftAddress,
          imageUrl: nft.imageUrl,
        })),
        skipDuplicates: true,
      });

      const nfts = await db.gMNFT.findMany({
        where: {
          gMSymbolOCCId: gmSymbolOCCId.id,
        },
      });

      const data = nfts.flatMap((nft) => {
        return Object.values(StickerType).map((stickerType) => ({
          nftAddress: nft.nftAddress,
          stickerType: stickerType,
          gMSymbolOCCId: gmSymbolOCCId.id,
          imageUrl: nft.imageUrl,
        }));
      });

      const stickers = await db.sticker.createManyAndReturn({
        data: data satisfies Prisma.StickerCreateManyInput[],
        skipDuplicates: true,
      });

      return {
        stickers,
      };
    }),
});
