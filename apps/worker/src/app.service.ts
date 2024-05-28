import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// @ts-ignore
import { groupBy } from 'lodash-es';
import { TelegramService } from './TelegramService.js';
import { db } from './db.js';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  // TODO: Make it run once per day
  @Cron('*/10 * * * * *')
  async updateEmotion() {
    this.logger.debug('Called every 10 seconds');
    const instance = await TelegramService.getInstance();

    const shareList = await db.share.findMany({
      where: { reactionUpdatedAt: null },
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

      // set them all to new Date()
      await Promise.all(
        shareList.map((s) =>
          db.share.update({
            where: { id: s.id },
            data: { reactionUpdatedAt: new Date() },
          }),
        ),
      );

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

        const [reactionMetadata] = reaction;

        console.log(
          `Updating share ${share.id} with reaction count ${reactionCount}`,
        );

        await db.share.update({
          where: { id: share.id },
          data: {
            reactionMetadata,
            reactionCount,
          },
        });
      }
    }
  }
}
