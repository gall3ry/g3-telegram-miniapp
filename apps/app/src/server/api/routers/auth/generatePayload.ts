import { TRPCError } from "@trpc/server";
import { TonProofService } from "../../../_services/ton-proof-service";
import { createPayloadToken } from "../../../_utils/jwt";
import { publicProcedure } from "../../trpc";

export const generatePayload = publicProcedure.query(async () => {
  try {
    const payload = TonProofService.generatePayload();
    const payloadToken = await createPayloadToken({ payload: payload });

    return {
      tonProof: payloadToken,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate payload",
    });
  }
});
