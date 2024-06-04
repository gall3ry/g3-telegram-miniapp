import { db } from "../../../../db";
import { BaseQuest, QuestId } from "./BaseQuest";

export class BindWalletAddressTask extends BaseQuest {
  id = QuestId.BIND_WALLET_ADDRESS;
  points = 100;
  title = "Bind wallet address";
  description = "Quest description and instruction details goes here.";

  async isUserFinishedQuest({ userId }: { userId: number }): Promise<boolean> {
    const provider = await db.provider.findFirst({
      where: { id: userId, type: "TON_WALLET" },
    });

    return !!provider;
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

  async getQuestMetadata(): Promise<Record<string, unknown>> {
    return {};
  }
}
