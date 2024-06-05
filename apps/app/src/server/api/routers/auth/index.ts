import { type Prisma } from "database";
import { db } from "../../../db";
import PostHogClient from "../../services/posthog";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { updateInputNameSchema } from "./_shared/updateInputNameSchema";
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
    .input(updateInputNameSchema)
    .mutation(
      async ({ ctx: { session }, input: { telegramId, displayName } }) => {
        const userId = session.userId;

        const client = PostHogClient();
        client.capture({
          distinctId: userId.toString(),
          event: "update_display_name",
          properties: {
            displayName: displayName,
          },
        });
        await client.shutdown();

        const toUpdate = {
          displayName: displayName,
          telegramId: telegramId?.toString(),
        } satisfies Prisma.UserUpdateInput;

        if (!telegramId) {
          delete toUpdate.telegramId;
        }

        if (!displayName) {
          delete toUpdate.displayName;
        }

        return db.user.update({
          where: {
            id: userId,
          },
          data: toUpdate,
          select: {
            id: true,
            displayName: true,
            telegramId: true,
          },
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
