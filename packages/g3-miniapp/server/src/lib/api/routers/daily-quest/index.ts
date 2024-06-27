import { createTRPCRouter } from '../../trpc';
import { completeDailyLogin } from './completeDailyLogin';
import { completeDailyShare } from './completeDailyShare';
import { getDailyQuestsInfo } from './getDailyQuestsInfo';

export const dailyQuestRouter = createTRPCRouter({
  completeDailyLogin,
  completeDailyShare,
  getDailyQuestsInfo,
});
