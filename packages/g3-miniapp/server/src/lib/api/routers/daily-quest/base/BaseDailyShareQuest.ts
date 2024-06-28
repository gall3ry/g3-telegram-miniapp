import {
  BaseDailyQuest,
  DailyShareQuestType,
  IsCompletePayload,
  mapTypeToPoint,
  mapTypeToShareCount,
  mapTypeToXP,
} from './BaseDailyQuest';

export abstract class BaseDailyShareQuest extends BaseDailyQuest {
  public readonly SHARE_COUNT: number;
  constructor(type: DailyShareQuestType) {
    super(type);

    this.SHARE_COUNT = mapTypeToShareCount[type];
  }

  override async isPassed({ userId, db }: IsCompletePayload) {
    const isPassed = await super.isPassed({ userId, db });
    if (!isPassed) {
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

  override async complete({ userId, db }: IsCompletePayload) {
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
  }
}
