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
    return db.dailyQuestUserInfo.findFirst({
      where: {
        userId: session.userId,
      },
      select: {
        dailyShareCount: true,
      },
    });
  }),
});
