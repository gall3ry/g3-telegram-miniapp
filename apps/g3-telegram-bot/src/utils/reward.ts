import { RewardService } from '@g3-miniapp-v2/rewards';
import { db } from './db';

export const rewardService = new RewardService(db);
