import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';
import { NotCompletedError } from './base/BaseDailyQuest';
import { DailyLogin } from './login/DailyLogin';

export const completeDailyLogin = protectedProcedure.mutation(
  async ({
    ctx: {
      session: { userId },
    },
  }) => {
    const instance = new DailyLogin();

    await db.$transaction(async (db) => {
      return instance.complete({ userId, db }).catch((err) => {
        if (err instanceof NotCompletedError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Already completed',
          });
        }

        throw err;
      });
    });

    return {
      success: true,
    };
  }
);
