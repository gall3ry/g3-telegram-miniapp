import { env } from '@gall3ry/g3-miniapp-env';
import { QuestId } from '@gall3ry/types';
import { TRPCError } from '@trpc/server';
import { db } from '../../../../db';
import { BaseQuest } from './BaseQuest';
import { telegramInstance } from './telegramInstance';

export class JoinCommunityTask extends BaseQuest {
  id = QuestId.JOIN_COMMUNITY;
  points = 50;
  description = 'Join the community to earn points';
  text = 'Join now';

  async isUserFinishedQuest({ userId }: { userId: number }): Promise<boolean> {
    const provider = await db.provider.findUnique({
      where: { id: userId, type: 'TELEGRAM' },
    });

    if (!provider) {
      return false;
    }

    const { value: telegramId } = provider;

    const isUserJoinedCommunity = await telegramInstance
      .hasUserJoinedGroup({
        chatId: env.NEXT_PUBLIC_COMMUNITY_CHAT_ID,
        userId: +telegramId,
      })
      .catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User has not joined the community',
        });
      });

    if (!isUserJoinedCommunity) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User has not joined the community',
      });
    }

    return isUserJoinedCommunity;
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
    return {
      chatId: env.NEXT_PUBLIC_COMMUNITY_CHAT_ID,
    };
  }
}
