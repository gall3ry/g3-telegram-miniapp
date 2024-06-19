import { env } from '@gall3ry/g3-miniapp-env';
import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { createOCC } from './createOCC';
import { getLeaderboard } from './getLeaderboard';
import { getMyCurrentLeaderboardPosition } from './getMyCurrentLeaderboardPosition';
import { getMyOccs, getTopOccs } from './getMyOccs';
import { getOcc } from './getOcc';
import { mintOCCbyEpic } from './mintOCC';
import { mintOCCbyTON } from './mintOCCbyTON';

export const occRouter = createTRPCRouter({
  // TODO: move it to worker
  createOCC,
  getMyOccs,
  getTopOccs,
  mintOCCbyEpic,
  mintOCCbyTON,
  getOcc: getOcc,
  getLeaderboard,
  getMyCurrentLeaderboardPosition,

  resetAccount: protectedProcedure.mutation(async ({ ctx: { session } }) => {
    if (env.NEXT_PUBLIC_G3_ENV === 'production') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Reset account is disabled in production',
      });
    }

    await db.$transaction([
      db.occ.deleteMany({
        where: {
          Provider: {
            userId: session.userId,
            type: 'TON_WALLET',
          },
        },
      }),
      db.user.update({
        where: {
          id: session.userId,
        },
        data: {
          point: 0,
          RewardLogs: {
            deleteMany: {},
          },
        },
      }),
    ]);

    return true;
  }),
});
