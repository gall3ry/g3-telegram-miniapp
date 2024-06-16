import { QuestId } from '@g3-miniapp-v2/types';
import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';
import { OccType } from './OccType';

export const mintOCCbyEpic = protectedProcedure
  .input(
    z.object({
      // TODO: Update type here when we have more than one OCC type
      type: z.nativeEnum(OccType),
    })
  )
  .mutation(async ({ ctx: { session } }) => {
    // validate txHash
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

    const EPIC_POINT_TO_MINT = 100;
    if (user.point < EPIC_POINT_TO_MINT) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Not enough epic point',
      });
    }

    // deduct user point
    await db.$transaction([
      db.user.update({
        where: {
          id: session.userId,
        },
        data: {
          point: {
            decrement: EPIC_POINT_TO_MINT,
          },
        },
      }),
      // save log to RewardLogs
      db.rewardLogs.create({
        data: {
          userId: session.userId,
          point: -EPIC_POINT_TO_MINT,
          taskId: QuestId.MINT_OCC_BY_EPIC_POINT,
          // taskId: "MINT_OCC_BY_EPIC_POINT",
        },
      }),
    ]);

    // TODO: Use real txHash and nftAddress later - now just for testing
    const txHash = uuidv4();
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
