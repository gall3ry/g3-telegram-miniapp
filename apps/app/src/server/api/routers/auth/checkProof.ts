import { TRPCError } from "@trpc/server";
import { CheckProofRequest } from "../../../_dto/check-proof-request-dto";
import { TonApiService } from "../../../_services/ton-api-service";
import { TonProofService } from "../../../_services/ton-proof-service";
import { createAuthToken, verifyToken } from "../../../_utils/jwt";
import { publicProcedure } from "../../trpc";

export const checkProof = publicProcedure
  .input(CheckProofRequest)
  .mutation(async ({ input: { address, network, proof, public_key } }) => {
    const client = TonApiService.create(network);
    const isValid = await TonProofService.checkProof(
      {
        address,
        public_key,
        proof,
        network,
      },
      (address) => client.getWalletPublicKey(address),
    );
    if (!isValid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid proof",
      });
    }

    const payloadToken = proof.payload;
    if (!(await verifyToken(payloadToken))) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      });
    }

    const token = await createAuthToken({
      address: address,
      network: network,
    });

    return { token: token };
  });
