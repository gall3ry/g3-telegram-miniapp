import { DailyQuestType } from '@prisma/client';
import {
  BaseDailyQuest,
  IsCompletePayload,
  mapTypeToPoint,
  mapTypeToXP,
} from '../base/BaseDailyQuest';

export class DailyLogin extends BaseDailyQuest {
  constructor() {
    super(DailyQuestType.DAILY_LOGIN);
  }

  async isPassed({ userId, db }: IsCompletePayload) {
    const isPassed = await super.isPassed({ userId, db });
    if (!isPassed) {
      return false;
    }

    // 0:00 GMT+0 of new Date
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const row = await db.dailyQuestUserInfo.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          {
            OR: [
              {
                lastLoginAt: {
                  gte: today,
                },
              },
              {
                lastLoginAt: null,
              },
            ],
          },
        ],
      },
    });

    return !!row;
  }

  override async complete({ userId, db }: IsCompletePayload) {
    await super.complete({ userId, db });

    const point = mapTypeToPoint[this.type];
    const xp = mapTypeToXP[this.type];

    await Promise.all([
      db.user.update({
        data: {
          point: {
            increment: point,
          },
        },
        where: {
          id: userId,
        },
      }),
      db.dailyQuestLog.create({
        data: {
          type: this.type,
          point: point,
          exp: xp,
          User: {
            connect: {
              id: userId,
            },
          },
        },
      }),
      db.gMSymbolOCC.updateMany({
        data: {
          exp: {
            increment: xp,
          },
        },
        where: {
          Occ: {
            Provider: {
              userId,
            },
          },
        },
      }),
      db.dailyQuestUserInfo.upsert({
        create: {
          userId,
          lastLoginAt: new Date(),
        },
        update: {
          lastLoginAt: new Date(),
        },
        where: {
          userId,
        },
      }),
    ]);
  }
}
