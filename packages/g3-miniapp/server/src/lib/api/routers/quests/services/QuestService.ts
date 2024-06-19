import { type QuestId, QuestStatus, mapQuestIdToTitle } from '@gall3ry/types';
import { TRPCError } from '@trpc/server';
import { db } from '../../../../db';
import PostHogClient, { Flag } from '../../../services/posthog';
import { type IQuest } from './BaseQuest';
import { BindWalletAddressTask } from './BindWalletAddressTask';
import { JoinCommunityTask } from './JoinCommunityQuest';
import { MintGMEpicQuest } from './MintGMEpicQuest';

export class QuestService {
  // singleton
  static instance: QuestService;
  static getInstance() {
    if (!QuestService.instance) {
      QuestService.instance = new QuestService();
    }
    return QuestService.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private async _getTasks({ userId }: { userId: number }) {
    const _tasks: IQuest[] = [
      new BindWalletAddressTask(),
      new MintGMEpicQuest(),
    ];

    const client = PostHogClient();
    if (await client.isFeatureEnabled(Flag.join_g3_community, 'default')) {
      _tasks.push(new JoinCommunityTask());
    }

    return Promise.all(
      _tasks.map(async (task) => {
        const [isRewardAlreadyGiven, metadata] = await Promise.all([
          task.isRewardAlreadyGiven({ userId }),
          task.getQuestMetadata?.({ userId }),
        ]);

        return {
          task,
          isRewardAlreadyGiven,
          metadata,
        };
      })
    );
  }

  private async _getTaskWithFilter({
    taskType,
    userId,
  }: {
    taskType: QuestStatus;
    userId: number;
  }) {
    const _tasks = await this._getTasks({
      userId,
    });

    switch (taskType) {
      case QuestStatus.ALL:
        return _tasks;
      case QuestStatus.COMPLETED: {
        return _tasks.filter((task) => task.isRewardAlreadyGiven);
      }
      case QuestStatus.INCOMPLETE: {
        return _tasks.filter((task) => !task.isRewardAlreadyGiven);
      }
      default:
        return [];
    }
  }

  async getTasks({
    taskType,
    userId,
  }: {
    taskType: QuestStatus;
    userId: number;
  }) {
    const filteredTasks = await this._getTaskWithFilter({
      taskType,
      userId,
    });

    return Promise.all(
      filteredTasks.map(async ({ task, isRewardAlreadyGiven, metadata }) => {
        // Avoid calling isFinishedQuest if the task is already claimed
        const isFinishedQuest =
          isRewardAlreadyGiven ||
          (await task.isUserFinishedQuest({ userId }).catch(() => false));

        return {
          id: task.id,
          points: task.points,
          metadata: metadata,
          title: mapQuestIdToTitle[task.id],
          description: task.description,
          text: task.text,
          isClaimed: isRewardAlreadyGiven,
          isFinishedQuest,
        };
      })
    );
  }

  async completeTaskOrThrow({
    taskId,
    userId,
  }: {
    taskId: QuestId;
    userId: number;
  }): Promise<void> {
    const _tasks = await this._getTasks({ userId });
    const result = _tasks.find(({ task }) => task.id === taskId);
    const { task } = result ?? {};

    if (!task) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Task not found',
      });
    }

    if (task.isRequiredWalletConnection && !this._hasWalletConnection(userId)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Wallet connection required',
      });
    }

    await task.completeQuestOrThrow({ userId });
  }

  private async _hasWalletConnection(userId: number) {
    const provider = await db.provider.findFirst({
      where: { id: userId, type: 'TON_WALLET' },
    });

    return !!provider;
  }
}
