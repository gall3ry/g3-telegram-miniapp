import { DailyQuestType, Prisma } from '@prisma/client';
import { db } from '../../../../db';
import {
  BaseDailyQuest,
  IsCompletePayload,
  mapTypeToPoint,
  mapTypeToShareCount,
  mapTypeToXP,
} from './BaseDailyQuest';

export abstract class BaseDailyShareQuest extends BaseDailyQuest {
  public readonly SHARE_COUNT: number;
  constructor(type: DailyQuestType) {
    super(type);

    this.SHARE_COUNT = mapTypeToShareCount[type];
  }

  async isCompleted({ userId }: IsCompletePayload) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const log = await db.dailyQuestLog.findFirst({
      where: {
        userId,
        type: this.type,
        createdAt: {
          gte: today,
        },
      },
    });

    if (log) {
      return false;
    }

    // Need to make sure we have reset the count, or user can hack this feature
    const row = await db.dailyQuestUserInfo.findFirst({
      where: {
        userId,
        dailyShareCount: {
          gte: this.SHARE_COUNT,
        },
      },
    });

    return !!row;
  }

  override async complete({ userId }: IsCompletePayload) {
    await db.$transaction(async (db: Prisma.TransactionClient) => {
      await super.complete({ userId, db });

      const point = mapTypeToPoint[this.type];
      const xp = mapTypeToXP[this.type];

      await Promise.all([
        db.dailyQuestLog.create({
          data: {
            type: this.type,
            userId,
            point: point,
            exp: xp,
          },
        }),
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
      ]);
    });
  }
}
