import { DailyQuestType } from '@prisma/client';
import { BaseDailyShareQuest } from '../base/BaseDailyShareQuest';

export class DailyShare6 extends BaseDailyShareQuest {
  constructor() {
    super(DailyQuestType.DAILY_SHARE_LEVEL_6);
  }
}
