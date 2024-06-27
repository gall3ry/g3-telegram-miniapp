import { DailyQuestType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';
import { NotCompletedError } from './base/BaseDailyQuest';
import { BaseDailyShareQuest } from './base/BaseDailyShareQuest';
import { DailyShare1 } from './share/level-1';
import { DailyShare2 } from './share/level-2';
import { DailyShare3 } from './share/level-3';
import { DailyShare4 } from './share/level-4';
import { DailyShare5 } from './share/level-5';
import { DailyShare6 } from './share/level-6';

export const completeDailyShare = protectedProcedure
  .input(
    z.object({
      type: z.enum([
        DailyQuestType.DAILY_SHARE_LEVEL_1,
        DailyQuestType.DAILY_SHARE_LEVEL_2,
        DailyQuestType.DAILY_SHARE_LEVEL_3,
        DailyQuestType.DAILY_SHARE_LEVEL_4,
        DailyQuestType.DAILY_SHARE_LEVEL_5,
        DailyQuestType.DAILY_SHARE_LEVEL_6,
      ]),
    })
  )
  .mutation(
    async ({
      ctx: {
        session: { userId },
      },
      input: { type },
    }) => {
      let instance: BaseDailyShareQuest | null = null;

      switch (type) {
        case DailyQuestType.DAILY_SHARE_LEVEL_1:
          instance = new DailyShare1();
          break;
        case DailyQuestType.DAILY_SHARE_LEVEL_2:
          instance = new DailyShare2();
          break;
        case DailyQuestType.DAILY_SHARE_LEVEL_3:
          instance = new DailyShare3();
          break;
        case DailyQuestType.DAILY_SHARE_LEVEL_4:
          instance = new DailyShare4();
          break;
        case DailyQuestType.DAILY_SHARE_LEVEL_5:
          instance = new DailyShare5();
          break;
        case DailyQuestType.DAILY_SHARE_LEVEL_6:
          instance = new DailyShare6();
          break;
        default:
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid type',
          });
      }

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
