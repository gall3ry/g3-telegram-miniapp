import { type RewardType } from "database";
import { z } from "zod";
import { db } from "../../../db";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export class RewardService {
  private static instance: RewardService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): RewardService {
    if (!RewardService.instance) {
      RewardService.instance = new RewardService();
    }

    return RewardService.instance;
  }

  static readonly _MAP_REWARD_TYPE_TO_POINT: Record<RewardType, number> = {
    BIND_WALLET_ADDRESS: 100,
  };

  public static async rewardUser({
    userId,
    rewardType,
  }: {
    userId: number;
    rewardType: RewardType;
  }) {
    const point = RewardService._MAP_REWARD_TYPE_TO_POINT[rewardType];
    await db.$transaction(async (db) => {
      await Promise.all([
        db.rewardLogs.create({
          data: {
            userId,
            rewardType,
            point,
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

  public async rewardForBindWalletAddress({ userId }: { userId: number }) {
    const isRewardAlreadyGiven = await db.rewardLogs.findFirst({
      where: {
        userId,
        rewardType: "BIND_WALLET_ADDRESS",
      },
    });

    if (isRewardAlreadyGiven) {
      // Do nothing here
      return;
    }

    await RewardService.rewardUser({
      userId,
      rewardType: "BIND_WALLET_ADDRESS",
    });
  }
}

export const rewardRouter = createTRPCRouter({
  getMyRewardLogList: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx: { session } }) => {
      const [items, total] = await Promise.all([
        db.rewardLogs.findMany({
          where: {
            userId: session.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        db.rewardLogs.count({
          where: {
            userId: session.userId,
          },
        }),
      ]);

      return {
        items,
        total,
      };
    }),
});
