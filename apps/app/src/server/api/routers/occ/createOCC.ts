import { tryNTimes } from "@repo/utils";
import { TRPCError } from "@trpc/server";
import { Prisma } from "database";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { getNFTIdAndOwnerFromTx } from "../../../../app/_utils/ton";
import { env } from "../../../../env";
import { db } from "../../../db";
import { pushToQueue, QUEUE_NAME } from "../../services/upstash";
import { protectedProcedure } from "../../trpc";
import { OccType } from "./OccType";

// move to worker (later)
export const createOCC = protectedProcedure
  .input(
    z.object({
      txHash: z.string().min(64).max(64),
      // TODO: Update type here when we have more than one OCC type
      type: z.nativeEnum(OccType),
    }),
  )
  .mutation(async ({ ctx: { session }, input: { txHash } }) => {
    // validate txHash
    const rawData = await tryNTimes({
      toTry: () =>
        getNFTIdAndOwnerFromTx(txHash, env.TON_API_KEY).catch(() => {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transaction not found",
          });
        }),
      interval: 5,
      times: 20,
    });

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
          .catch((e) => {
            if (
              e instanceof Prisma.PrismaClientKnownRequestError &&
              e.code === "P2025"
            ) {
              ctx.addIssue({
                code: "custom",
                message: "Owner not found",
                path: ["txHash"],
              });
            } else {
              throw e;
            }
          });

        if (!provider) {
          return;
        }

        if (provider.value !== owner) {
          ctx.addIssue({
            code: "custom",
            message: `Owner mismatch: ${provider.value} !== ${owner}`,
          });
        }
      });

    const { nftAddress } = await _schema.parseAsync(rawData);

    const { id: providerId } = await db.provider.findFirstOrThrow({
      where: {
        value: rawData.owner,
        type: "TON_WALLET",
        userId: session.userId,
      },
    });

    if (await db.occ.findFirst({ where: { nftAddress } })) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "OCC already exists",
      });
    }

    const uuid = uuidv4();
    const occ = await db.occ.create({
      data: {
        txHash,
        providerId,
        nftAddress,
        uuid,
        // TODO: Update this when we have more than one OCC type
        GMSymbolOCC: {
          create: {},
        },
      },
    });

    if (env.NODE_ENV !== "development") {
      const urlToFetch = `${env.WORKER_PUBLIC_URL}/webhook/occ/capture-gif`;
      await pushToQueue(QUEUE_NAME.OCC_CAPTURE_GIF, {
        url: urlToFetch,
        body: { occUUID: uuid },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return {
      id: occ.id,
    };
  });
