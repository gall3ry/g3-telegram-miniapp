import { db } from '../../../db';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { completeDailyLogin } from './completeDailyLogin';
import { completeDailyShare } from './completeDailyShare';
import { getDailyQuestsInfo } from './getDailyQuestsInfo';

export const dailyQuestRouter = createTRPCRouter({
  completeDailyLogin,
  completeDailyShare,
  getDailyQuestsInfo,
  getTodayShare: protectedProcedure.query(async ({ ctx: { session } }) => {
    return db.dailyQuestUserInfo.upsert({
      where: {
        userId: session.userId,
      },
      create: {
        userId: session.userId,
        dailyShareCount: 0,
      },
      update: {},
      select: {
        dailyShareCount: true,
      },
    });
  }),
});
