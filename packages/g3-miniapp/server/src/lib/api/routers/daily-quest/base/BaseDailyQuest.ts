import { DailyQuestType, Prisma } from '@prisma/client';

export type DailyShareQuestType =
  | 'DAILY_SHARE_LEVEL_1'
  | 'DAILY_SHARE_LEVEL_2'
  | 'DAILY_SHARE_LEVEL_3'
  | 'DAILY_SHARE_LEVEL_4'
  | 'DAILY_SHARE_LEVEL_5'
  | 'DAILY_SHARE_LEVEL_6';

export const mapTypeToPoint = {
  DAILY_LOGIN: 50,
  DAILY_SHARE_LEVEL_1: 50,
  DAILY_SHARE_LEVEL_2: 40,
  DAILY_SHARE_LEVEL_3: 80,
  DAILY_SHARE_LEVEL_4: 150,
  DAILY_SHARE_LEVEL_5: 300,
  DAILY_SHARE_LEVEL_6: 580,
} satisfies Record<DailyQuestType, number>;

export const mapTypeToXP = {
  DAILY_LOGIN: 0,
  DAILY_SHARE_LEVEL_1: 50,
  DAILY_SHARE_LEVEL_2: 100,
  DAILY_SHARE_LEVEL_3: 100,
  DAILY_SHARE_LEVEL_4: 100,
  DAILY_SHARE_LEVEL_5: 100,
  DAILY_SHARE_LEVEL_6: 100,
} satisfies Record<DailyQuestType, number>;

export const mapTypeToShareCount = {
  DAILY_SHARE_LEVEL_1: 2,
  DAILY_SHARE_LEVEL_2: 5,
  DAILY_SHARE_LEVEL_3: 10,
  DAILY_SHARE_LEVEL_4: 20,
  DAILY_SHARE_LEVEL_5: 50,
  DAILY_SHARE_LEVEL_6: 100,
} satisfies Record<DailyShareQuestType, number>;

export class NotCompletedError extends Error {
  constructor() {
    super('Not completed');
  }
}

export class AlreadyCompletedError extends Error {
  constructor() {
    super('Already completed');
  }
}

export abstract class BaseDailyQuest {
  constructor(public type: DailyQuestType) {}

  /**
   * Check if the quest is completed or not
   * If user claims the reward, it should always return true
   *
   * @param payload
   */
  async isPassed(payload: IsCompletePayload): Promise<boolean> {
    const isClaimed = await this.isClaimed(payload);

    // if time === 0:00, we should not allow user to claim the reward
    if (new Date().getHours() === 0 && new Date().getMinutes() === 0) {
      return false;
    }

    if (isClaimed) {
      return false;
    }

    return true;
  }

  /**
   * Check if the quest is claimed or not
   *
   * @param payload
   */
  async isClaimed({ db, userId }: IsCompletePayload): Promise<boolean> {
    // 0:00 GMT+0 of new Date
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const row = await db.dailyQuestLog.findFirst({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
        type: this.type,
      },
    });

    return !!row;
  }

  async complete({ userId, db }: IsCompletePayload): Promise<void> {
    const isPassed = await this.isPassed({ userId, db });

    if (!isPassed) {
      throw new NotCompletedError();
    }
  }
}
export type IsCompletePayload = {
  userId: number;
  db: Prisma.TransactionClient;
};
