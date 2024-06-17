import { RewardService } from '@gall3ry/data-access-rewards';
import { db } from './db';

export const rewardService = new RewardService(db);
