import { RewardService } from '@services/rewards';
import { db } from './db';

export const rewardService = new RewardService(db);
