import { ProviderType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '../../../db';
import { CheckProofRequest } from '../../../ton/_dto/check-proof-request-dto';
import { TonApiService } from '../../../ton/_services/ton-api-service';
import { TonProofService } from '../../../ton/_services/ton-proof-service';
import { verifyToken } from '../../../ton/_utils/jwt';
import { AuthenticationService } from '../../services/authentication';
import { protectedProcedure, publicProcedure } from '../../trpc';

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
      (address) => client.getWalletPublicKey(address)
    );
    if (!isValid) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid proof',
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
        code: 'BAD_REQUEST',
        message: 'Invalid token',
      });
    }
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

    const { token } = await AuthenticationService.upsertUserWithProvider({
      value: address,
      providerType: 'TON_WALLET',
    });

    return { token };
  });

export const connectMoreProvider = protectedProcedure
  .input(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal(ProviderType.TON_WALLET),
        proof: CheckProofRequest,
      }),
    ])
  )
  .mutation(
    async ({
      input: { type, ...rest },
      ctx: {
        session: { userId },
      },
    }) => {
      switch (type) {
        case 'TON_WALLET': {
          await CheckProofService.checkProofOrThrow(rest.proof);

          await AuthenticationService.connectProvider({
            value: rest.proof.address,
            providerType: 'TON_WALLET',
            userId,
          });

          return {
            success: true,
          };
        }

        default: {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid provider type',
          });
        }
      }
    }
  );
