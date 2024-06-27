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

  async isCompleted({ userId, db }: IsCompletePayload) {
    // 0:00 GMT+0 of new Date
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const row = await db.dailyQuestUserInfo.findFirst({
      where: {
        userId,
        lastLoginAt: {
          gte: today,
        },
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
          userId,
          point: point,
          exp: xp,
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
      db.dailyQuestUserInfo.update({
        data: {
          lastLoginAt: new Date(),
          userId,
        },
        where: {
          userId,
        },
      }),
    ]);
  }
}
