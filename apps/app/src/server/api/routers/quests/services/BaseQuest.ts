import { TRPCError } from "@trpc/server";
import { RewardService } from "../../reward";
import { type QuestId } from "./QuestId";

export interface IQuest {
  readonly id: QuestId;
  readonly title: string;
  readonly points: number;
  readonly description: string;
  readonly text?: string;

  isQuestCompleted({ userId }: { userId: number }): Promise<boolean>;
  completeQuestOrThrow({ userId }: { userId: number }): Promise<void>;

  /**
   * Check if the user has finished the quest
   * @param userId
   *  The user id
   * @returns
   * True if the user has finished the quest
   * @throws
   * If the user has not finished the quest
   */
  isUserFinishedQuest({ userId }: { userId: number }): Promise<boolean>;
  isRewardAlreadyGiven({ userId }: { userId: number }): Promise<boolean>;

  getQuestMetadata?({
    userId,
  }: {
    userId: number;
  }): Promise<Record<string, unknown>>;
}

export abstract class BaseQuest implements IQuest {
  abstract id: QuestId;
  abstract points: number;
  abstract title: string;
  abstract description: string;
  text: string | undefined = undefined;

  async isQuestCompleted({ userId }: { userId: number }): Promise<boolean> {
    return (
      !(await this.isRewardAlreadyGiven({ userId })) &&
      (await this.isUserFinishedQuest({ userId }))
    );
  }
  async completeQuestOrThrow({ userId }: { userId: number }): Promise<void> {
    if (await this.isRewardAlreadyGiven({ userId })) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Reward already given",
      });
    }

    if (!(await this.isUserFinishedQuest({ userId }))) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Quest not completed",
      });
    }

    await RewardService.rewardUser({
      taskId: this.id,
      userId,
    });
  }

  abstract isUserFinishedQuest({
    userId,
  }: {
    userId: number;
  }): Promise<boolean>;
  abstract isRewardAlreadyGiven({
    userId,
  }: {
    userId: number;
  }): Promise<boolean>;

  abstract getQuestMetadata?({
    userId,
  }: {
    userId: number;
  }): Promise<Record<string, unknown>>;
}
