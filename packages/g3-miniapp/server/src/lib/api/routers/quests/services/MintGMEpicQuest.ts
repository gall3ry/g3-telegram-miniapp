import { QuestId } from '@gall3ry/types';
import { db } from '../../../../db';
import { BaseQuest } from './BaseQuest';

export class MintGMEpicQuest extends BaseQuest {
  id = QuestId.MINT_GM_EPIC_QUEST;
  points = 100;
  description = 'Mint GM Epic Quest';
  text = 'Mint GM Epic Quest';
  isRequiredWalletConnection = true;

  async isUserFinishedQuest({ userId }: { userId: number }): Promise<boolean> {
    const gmOCC = await db.gMSymbolOCC.findFirst({
      where: {
        Occ: {
          Provider: {
            userId,
          },
        },
      },
    });

    return !!gmOCC;
  }

  async isRewardAlreadyGiven({ userId }: { userId: number }): Promise<boolean> {
    const result = await db.rewardLogs.findFirst({
      where: {
        userId,
        taskId: this.id,
      },
    });

    return !!result;
  }

  async getQuestMetadata() {
    return {};
  }
}
