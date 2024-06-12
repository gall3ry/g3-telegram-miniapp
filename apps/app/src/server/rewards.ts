// globalThis
import { RewardService } from "@services/rewards";
import { env } from "../env";
import { db } from "./db";

const createRewardService = () => {
  return new RewardService(db);
};

const globalForRewardService = globalThis as unknown as {
  rewardService: ReturnType<typeof createRewardService> | undefined;
};

export const rewardService =
  globalForRewardService.rewardService ?? createRewardService();

if (env.NODE_ENV !== "production")
  globalForRewardService.rewardService = rewardService;
