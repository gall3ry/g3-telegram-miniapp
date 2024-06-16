import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import { db } from "../../../db";
import { CheckProofRequest } from "../../../ton/_dto/check-proof-request-dto";
import { TonApiService } from "../../../ton/_services/ton-api-service";
import { TonProofService } from "../../../ton/_services/ton-proof-service";
import { createAuthToken, verifyToken } from "../../../ton/_utils/jwt";
import PostHogClient from "../../services/posthog";
import { publicProcedure } from "../../trpc";

class CheckProofService {
  static async checkProofOrThrow({
    address,
    network,
    proof,
    public_key,
  }: z.infer<typeof CheckProofRequest>) {
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

    const { payload: payloadToken } =
      await db.mapTonProofToPayload.findUniqueOrThrow({
        where: {
          id: proof.payload,
        },
      });

    if (!(await verifyToken(payloadToken))) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      });
    }
  }

  static async createUserWithProvider({
    address,
    network,
  }: {
    address: string;
    network: z.infer<typeof CheckProofRequest>["network"];
  }) {
    const exist = await db.provider.findFirst({
      where: { value: address, type: "TON_WALLET" },
    });

    const client = PostHogClient();

    const provider = await db.provider.upsert({
      where: {
        type_value: {
          type: "TON_WALLET",
          value: address,
        },
      },
      create: {
        type: "TON_WALLET",
        value: address,
        User: {
          create: {},
        },
      },
      update: {},
      include: {
        User: true,
      },
    });

    const user = provider.User;
    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No user associated with this address",
      });
    }

    if (!exist) {
      client.capture({
        distinctId: user.id.toString(),
        event: "new_user",
        properties: {
          address: address,
          network: network,
          type: "TON_WALLET",
        },
      });
    } else {
      client.capture({
        distinctId: user.id.toString(),
        event: "returning_user",
        properties: {
          address: address,
          network: network,
          type: "TON_WALLET",
        },
      });
    }
    await client.shutdown();

    const token = await createAuthToken({
      address: address,
      network: network,
      userId: user.id,
    });

    return { token };
  }
}

export const checkProof = publicProcedure
  .input(CheckProofRequest)
  .mutation(async ({ input: { address, network, proof, public_key } }) => {
    await CheckProofService.checkProofOrThrow({
      address,
      network,
      proof,
      public_key,
    });

    const { token } = await CheckProofService.createUserWithProvider({
      address,
      network,
    });

    return { token: token };
  });
