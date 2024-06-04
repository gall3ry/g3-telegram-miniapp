import { z } from "zod";
import { db } from "../../../db";
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
        displayName: z
          .string()
          .min(5)
          .max(50)
          .trim()
          .regex(/^[a-z0-9_]+$/)
          .optional(),
        telegramId: z.number(),
      }),
    )
    .mutation(
      async ({ ctx: { session }, input: { telegramId, displayName } }) => {
        const userId = session.userId;
        await db.user.update({
          where: {
            id: userId,
          },
          data: {
            displayName: displayName,
            telegramId: telegramId.toString(),
          },
        });
      },
    ),
});
