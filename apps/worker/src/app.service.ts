import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// @ts-ignore
import { groupBy } from 'lodash-es';
import { TelegramService } from './TelegramService.js';
import { db } from './db.js';
import { EmojiService } from './services/emoji.js';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  // 2 minutes for testing
  @Cron('0 */2 * * * *')
  async updateEmotion() {
    this.logger.debug(`[updateEmotion] Start`);
    const instance = await TelegramService.getInstance();

    const shareList = await db.share.findMany({
      where: {
        // LIVE TIME
        // reactionUpdatedAt: { lte: new Date(Date.now() - 1000 * 60 * 60 * 24) }, // 24 hours
      },
      orderBy: {
        id: 'desc',
      },
    });

    const groupedShare = groupBy(shareList, 'superGroupUsername');

    for (const [groupName, share] of Object.entries(groupedShare)) {
      console.log(
        `Processing group ${groupName}, share count: ${share.length}`,
      );
      const reactions = await instance.getReactionsByIds({
        groupName: groupName,
        ids: share.map((s) => +s.messageId),
      });

      for (const [msgId, reaction] of Object.entries(reactions)) {
        const share = shareList.find((s) => s.messageId === msgId);
        if (!share) {
          continue;
        }

        const reactionCount = reaction.reduce((acc, { reactions }) => {
          return (
            acc +
            Object.values(reactions).reduce((acc, reactions) => {
              return acc + reactions.count;
            }, 0)
          );
        }, 0);

        console.log(
          `Updating share ${share.id} with reaction count ${reactionCount}`,
        );

        await db.share.update({
          where: { id: share.id },
          data: {
            Reaction: {
              deleteMany: {},
            },
          },
        });

        await db.share.update({
          where: { id: share.id },
          data: {
            reactionCount,
            reactionUpdatedAt: new Date(),
            Reaction: {
              createMany: {
                data: await Promise.all(
                  reaction
                    .map(({ reactions }) => {
                      return Object.entries(reactions).map(
                        async ([_, { count, reaction }]) => {
                          const emoticon: string = (reaction as any)?.emoticon;
                          const getEmojiDataFromNative =
                            EmojiService.getInstance().getEmojiDataFromNative;
                          const unifiedCode =
                            (await getEmojiDataFromNative(emoticon))?.unified ??
                            (await getEmojiDataFromNative(`❌`))?.unified;

                          return {
                            reactionType: emoticon,
                            count,
                            unifiedCode,
                          };
                        },
                      );
                    })
                    .flat(),
                ),
              },
            },
          },
        });
      }

      // avoid rate limit
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  @Cron('0 0 * * *') // At 00:00
  async resetMapping() {
    const { count } = await db.mapTonProofToPayload.deleteMany({});
    this.logger.debug('[resetMapping] Deleted %d mappings', count);
  }
}
