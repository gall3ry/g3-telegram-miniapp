import { PrismaClient } from "@prisma/client";
import { type QuestId } from "@repo/types";

export class RewardService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  static readonly _MAP_REWARD_TYPE_TO_POINT: Record<QuestId, number> = {
    JOIN_COMMUNITY: 50,
    BIND_WALLET_ADDRESS: 100,
    MINT_GM_EPIC_QUEST: 100,
    POINT_RECEIVED_FROM_FRIEND: 25,
    SHARING_FRIEND_STICKER: 25,
    SHARING_MY_STICKER: 50,
  };

  public async rewardUser({
    userId,
    taskId,
    metadata,
  }: {
    userId: number;
    taskId: QuestId;
    metadata?: Record<string, any>;
  }) {
    const point = RewardService._MAP_REWARD_TYPE_TO_POINT[taskId];

    await this.db.$transaction(async (db) => {
      await Promise.all([
        db.rewardLogs.create({
          data: {
            userId,
            taskId,
            point,
            metadata,
          },
        }),
        db.user.update({
          where: {
            id: userId,
          },
          data: {
            point: {
              increment: point,
            },
          },
        }),
      ]);
    });
  }
}
