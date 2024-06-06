import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getNFTIdAndOwnerFromTx } from "../../../../app/utils/ton";
import { env } from "../../../../env";
import { db } from "../../../db";
import { protectedProcedure } from "../../trpc";

// move to worker (later)
export const createOCC = protectedProcedure
  .input(
    z
      .object({
        occTemplateId: z.number(),
        txHash: z.string(),
      })
      .superRefine(({ txHash }, ctx) => {
        if (txHash.length !== 64) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid transaction hash",
          });
        }
      }),
  )
  .mutation(async ({ ctx: { session }, input: { occTemplateId, txHash } }) => {
    // validate txHash
    const rawData = await getNFTIdAndOwnerFromTx(txHash, env.TON_API_KEY).catch(
      () => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      },
    );

    const _schema = z
      .object({
        nftAddress: z.string(),
        owner: z.string(),
      })
      .superRefine(async ({ owner }, ctx) => {
        const provider = await db.provider
          .findFirstOrThrow({
            where: {
              value: {
                equals: owner,
                mode: "insensitive",
              },
              type: "TON_WALLET",
              userId: session.userId,
            },
          })
          .catch(() => {
            ctx.addIssue({
              code: "custom",
              message: "Owner not found",
            });
          });

        if (!provider) {
          return;
        }

        if (provider.value !== owner) {
          ctx.addIssue({
            code: "custom",
            message: "Owner not found",
          });
        }
      });

    const { nftAddress } = await _schema.parseAsync(rawData);

    const occ = await db.occ.create({
      data: {
        occTemplateId,
        userId: session.userId,
        nftAddress,
      },
    });

    return {
      id: occ.id,
    };
  });
