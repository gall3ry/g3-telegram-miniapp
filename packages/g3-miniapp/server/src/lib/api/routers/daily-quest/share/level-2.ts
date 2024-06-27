import { DailyQuestType } from '@prisma/client';
import { BaseDailyShareQuest } from '../base/BaseDailyShareQuest';

export class DailyShare2 extends BaseDailyShareQuest {
  constructor() {
    super(DailyQuestType.DAILY_SHARE_LEVEL_2);
  }
}
