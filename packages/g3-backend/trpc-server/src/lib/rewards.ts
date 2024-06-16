// globalThis
import { RewardService } from '@g3-miniapp-v2/data-access-rewards';
import { db } from './db';
import { env } from './env';

const createRewardService = () => {
  return new RewardService(db);
};

const globalForRewardService = globalThis as unknown as {
  rewardService: ReturnType<typeof createRewardService> | undefined;
};

export const rewardService =
  globalForRewardService.rewardService ?? createRewardService();

if (env.NODE_ENV !== 'production')
  globalForRewardService.rewardService = rewardService;
