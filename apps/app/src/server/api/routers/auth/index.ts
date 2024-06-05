import { type Prisma } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { capture } from "../../services/posthog";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { checkProof } from "./checkProof";
import { generatePayload } from "./generatePayload";
import { getCurrentUser } from "./getCurrentUser";

export const authRouter = createTRPCRouter({
  checkProof: checkProof,
  generatePayload: generatePayload,
  getAuthTestText: protectedProcedure.query(() => {
    return "You are authenticated!";
  }),
  getCurrentUser: getCurrentUser,
  updateDisplayName: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(5).max(50).trim().optional(),
        telegramId: z.number().optional(),
        avatarUrl: z.string().url().optional(),
      }),
    )
    .mutation(
      async ({
        ctx: { session },
        input: { telegramId, displayName, avatarUrl },
      }) => {
        const userId = session.userId;

        void capture({
          distinctId: userId.toString(),
          event: "update_display_name",
          properties: {
            displayName: displayName,
          },
        });

        const toUpdate = {
          displayName: displayName,
          telegramId: telegramId?.toString(),
          avatarUrl,
        } satisfies Prisma.UserUpdateInput;

        if (!telegramId) {
          delete toUpdate.telegramId;
        }

        if (!displayName) {
          delete toUpdate.displayName;
        }

        await db.user.update({
          where: {
            id: userId,
          },
          data: toUpdate,
        });
      },
    ),

  getMyStats: protectedProcedure.query(async ({ ctx: { session } }) => {
    // total share, total reactions, total minted
    const userId = session.userId;

    const [totalShare, totalReaction, totalMinted] = await Promise.all([
      db.share.count({
        where: {
          occ: {
            userId: userId,
          },
        },
      }),
      db.share
        .aggregate({
          where: {
            occ: {
              userId: userId,
            },
          },
          _sum: {
            reactionCount: true,
          },
        })
        .then((res) => res._sum.reactionCount ?? 0),
      db.occ.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    return {
      totalShare,
      totalReaction,
      totalMinted,
    };
  }),
});
