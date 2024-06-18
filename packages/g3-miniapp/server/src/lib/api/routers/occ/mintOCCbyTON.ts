import { OccType } from '@gall3ry/types';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';

export const mintOCCbyTON = protectedProcedure
  .input(
    z.object({
      txHash: z.string(),
      // TODO: Update type here when we have more than one OCC type
      type: z.nativeEnum(OccType),
    })
  )
  .mutation(async ({ ctx: { session }, input: { txHash } }) => {
    // validate txHash
    if (!txHash) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Transaction not found',
      });
    }

    // check is user enough epic point to mint OCC, need 100 epic point
    const user = await db.user.findFirst({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // TODO: Use real txHash and nftAddress later - now just for testing
    const nftAddress = uuidv4();

    const { id: providerId } = await db.provider.findFirstOrThrow({
      where: {
        type: 'TON_WALLET',
        userId: session.userId,
      },
    });

    if (await db.occ.findFirst({ where: { nftAddress } })) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'OCC already exists',
      });
    }

    const occ = await db.occ.create({
      data: {
        txHash,
        providerId,
        nftAddress,
        // TODO: Update this when we have more than one OCC type
        GMSymbolOCC: {
          create: {},
        },
      },
    });

    return {
      id: occ.id,
    };
  });
