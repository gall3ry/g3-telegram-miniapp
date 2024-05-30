import { TRPCError } from "@trpc/server";
import ShortUniqueId from "short-unique-id";
import { TonProofService } from "../../../_services/ton-proof-service";
import { createPayloadToken } from "../../../_utils/jwt";
import { db } from "../../../db";
import { publicProcedure } from "../../trpc";

const { randomUUID } = new ShortUniqueId({ length: 20 });

export const generatePayload = publicProcedure.query(async () => {
  try {
    const payload = TonProofService.generatePayload();
    const payloadToken = await createPayloadToken({ payload: payload });

    const { id: tonProof } = await db.mapTonProofToPayload.create({
      data: {
        id: randomUUID(),
        payload: payloadToken,
      },
    });

    return {
      tonProof,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate payload",
    });
  }
});
