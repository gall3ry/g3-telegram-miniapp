import { TRPCError } from "@trpc/server";
import { StickerType } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const stickerRouter = createTRPCRouter({
  unlockSticker: protectedProcedure
    .input(
      z.object({ stickerType: z.nativeEnum(StickerType), occId: z.number() }),
    )
    .mutation(async ({ input: { stickerType, occId } }) => {
      // TODO: check level

      switch (stickerType) {
        case "Sample1": {
          const sticker = await db.sticker.findFirst({
            where: { stickerType },
          });

          if (sticker) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You already unlocked this sticker",
            });
          }

          await db.sticker.create({
            data: {
              stickerType,
              GMSymbolOCC: {
                create: {
                  Occ: {
                    connect: {
                      id: occId,
                    },
                  },
                },
              },
            },
          });
          break;
        }
      }

      return { success: true };
    }),

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
});
