import { db } from '../../../db';
import { protectedProcedure } from '../../trpc';
import { mapTypeToPoint } from './base/BaseDailyQuest';
import { DailyLogin } from './login/DailyLogin';
import { DailyShare1 } from './share/level-1';
import { DailyShare2 } from './share/level-2';
import { DailyShare3 } from './share/level-3';
import { DailyShare4 } from './share/level-4';
import { DailyShare5 } from './share/level-5';
import { DailyShare6 } from './share/level-6';

export const getDailyQuestsInfo = protectedProcedure.query(
  async ({
    ctx: {
      session: { userId },
    },
  }) => {
    const quests = [
      new DailyLogin(),
      new DailyShare1(),
      new DailyShare2(),
      new DailyShare3(),
      new DailyShare4(),
      new DailyShare5(),
      new DailyShare6(),
    ];

    const results = await Promise.all(
      quests.map(async (quest) => {
        const [isPassed, isClaimed] = await Promise.all([
          quest.isPassed({ userId, db }),
          quest.isClaimed({ userId, db }),
        ]);

        return {
          type: quest.type,
          isPassed,
          isClaimed,
          point: mapTypeToPoint[quest.type],
        };
      })
    );

    return results;
  }
);
