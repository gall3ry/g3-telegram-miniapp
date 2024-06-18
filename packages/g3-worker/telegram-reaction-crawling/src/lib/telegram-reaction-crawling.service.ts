import { EmojiService } from '@g3-worker/emoji';
import { EnvService } from '@g3-worker/env';
import { PrismaService } from '@g3-worker/prisma-client';
import { TelegramService } from '@g3-worker/telegram';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import groupBy from 'lodash.groupby';
import PQueue from 'p-queue';
import { Browser, chromium } from 'playwright';
import { z } from 'zod';

@Injectable()
export class TelegramReactionCrawlingService {
  private readonly logger = new Logger(TelegramReactionCrawlingService.name);

  constructor(
    private db: PrismaService,
    private telegramService: TelegramService,
    private envService: EnvService,
    private emojiService: EmojiService
  ) {}

  // 2 minutes for testing
  @Cron('0 */2 * * * *')
  async updateEmotion() {
    const db = this.db;
    const instance = this.telegramService;

    this.logger.debug(`[updateEmotion] Start`);

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
        `Processing group ${groupName}, share count: ${share.length}`
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
          `Updating share ${share.id} with reaction count ${reactionCount}`
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
                        async ([, { count, reaction }]) => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const emoticon: string = (reaction as any)?.emoticon;
                          const getEmojiDataFromNative =
                            this.emojiService.getEmojiDataFromNative;

                          const unifiedCode =
                            (await getEmojiDataFromNative(emoticon))?.unified ??
                            (await getEmojiDataFromNative(`❌`))?.unified;

                          return {
                            reactionType: emoticon,
                            count,
                            unifiedCode,
                          };
                        }
                      );
                    })
                    .flat()
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
    const { count } = await this.db.mapTonProofToPayload.deleteMany({});
    this.logger.debug('[resetMapping] Deleted %d mappings', count);
  }

  async getGif(payload: {
    stickerIds: number[];
  }): Promise<{ stickerId: number; cdnUrl: string }[]> {
    const db = this.db;

    console.log(`[getGif] Start, payload: ${JSON.stringify(payload)}`);
    const fn = z
      .function()
      .args(
        z.object({
          stickerIds: z.array(z.number()),
        })
      )
      .returns(
        z.promise(
          z.array(
            z.object({
              stickerId: z.number(),
              cdnUrl: z.string(),
            })
          )
        )
      )
      .implement(async ({ stickerIds }) => {
        let browser: Browser | null = null;
        try {
          const pqueue = new PQueue({ concurrency: 2 });
          browser = await chromium.launch({
            headless: true,
          });

          const stickers = await db.sticker.findMany({
            where: {
              id: {
                in: stickerIds,
              },
            },
          });

          const result = await pqueue.addAll(
            stickers.map(({ id }) => async () => {
              const page = await browser.newPage();
              const url = `${this.envService.get(
                'FRONTEND_URL'
              )}/stickers/${id}?record=true`;

              await page.goto(url);
              // add event listener (gif)
              const base64 = await page.evaluate(() => {
                return new Promise<string>((resolve, reject) => {
                  window.addEventListener('gif', (e: unknown) => {
                    const gif = e as CustomEvent<string>;

                    resolve(gif.detail);
                  });

                  setTimeout(() => {
                    reject(new Error('Timeout'));
                  }, 30 * 1000);
                });
              });
              const { url: cdnUrl } = await this._uploadGif({ base64 });

              return {
                stickerId: id,
                cdnUrl,
              };
            })
          );

          return result;
        } catch (e) {
          console.error(e);
          throw e;
        } finally {
          if (browser) {
            await browser.close();
          }
        }
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return fn(payload) as any;
  }

  private _uploadGif(payload: { base64: string }) {
    return z
      .function()
      .args(
        z.object({
          base64: z.string(),
        })
      )
      .implement(async ({ base64 }) => {
        //data:image/gif;base64
        const file = base64.replace(/^data:image\/gif;base64,/, '');

        const response = await fetch('https://api.akord.com/files', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Api-Key': 'IMHfyQuS4s6WOKzdJ1frI56WaxuuJ79qarJFekQq',
            'Content-Type': 'image/gif',
          },
          body: Buffer.from(file, 'base64'),
        });
        const result = await response.json();
        const url = result.cloud.url;

        return { url: url as string };
      })(payload);
  }
}
