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
    super('Already completed');
  }
}

export abstract class BaseDailyQuest {
  constructor(public type: DailyQuestType) {}

  abstract isCompleted(payload: IsCompletePayload): Promise<boolean>;
  async complete({ userId, db }: IsCompletePayload): Promise<void> {
    const isCompleted = await this.isCompleted({ userId, db });

    if (isCompleted) {
      throw new NotCompletedError();
    }
  }
}
export type IsCompletePayload = {
  userId: number;
  db: Prisma.TransactionClient;
};
