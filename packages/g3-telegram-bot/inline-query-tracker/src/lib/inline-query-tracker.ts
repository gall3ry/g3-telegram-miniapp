import { BaseModule } from '@g3-telegram-bot/types';
import { RewardService } from '@gall3ry/data-access-rewards';
import { Prisma, PrismaClient } from '@gall3ry/database-client';
import { mapStickerTypeToStickerTemplate, QuestId } from '@gall3ry/types';
import { Logger } from 'pino';
import { Telegraf } from 'telegraf';
import { InputTextMessageContent } from 'telegraf/types';
import { z } from 'zod';
import { isChatTypeSupported } from './constants';
import { PersistentDb, persistentDb } from './persistent-db';
import { parseInlineQuerySchema } from './schema/parseInlineQuerySchema';

export class InlineQueryTrackerModule extends BaseModule {
  name = 'InlineQueryTrackerModule';
  description = 'Module to track inline query';

  async onInitializeListeners() {
    // Do nothing
  }

  async onInitializeCommands({
    bot,
    db,
    logger,
  }: {
    bot: Telegraf;
    db: PrismaClient;
    logger: Logger;
  }): Promise<void> {
    const rewardService = new RewardService(db);

    bot.on('inline_query', async (ctx) => {
      try {
        // TODO: split to handlers
        const { query, from, chat_type } = ctx.inlineQuery;
        const [_id] = query.split(' ');

        // Validate inputs
        logger.debug({
          _id,
        });
        const { stickerId } = parseInlineQuerySchema({
          stickerId: _id,
        });
        const sticker = await db.sticker.findUnique({
          where: { id: stickerId },
        });
        if (!sticker) {
          logger.error({ stickerId }, `Sticker not found`);
          return;
        }

        const { stickerType, imageUrl } = sticker;

        if (!from.username || !chat_type) {
          // This will not happen
          return;
        }

        persistentDb.appendUserData(ctx.inlineQuery.from.id, {
          stickerId,
          chatType: ctx.inlineQuery.chat_type,
        });

        await ctx.telegram.answerInlineQuery(
          ctx.inlineQuery.id,
          [
            {
              type: 'article',
              id: `${stickerId} ${from.id}`,
              title: mapStickerTypeToStickerTemplate[stickerType].title,
              thumbnail_url:
                'https://api.akord.com/files/1ee325b1-7cf1-42ea-bc25-ac28c0ea32e3',
              description:
                mapStickerTypeToStickerTemplate[stickerType].description,
              input_message_content: {
                message_text: 'Good morning',
                link_preview_options: {
                  prefer_large_media: true,
                  prefer_small_media: false,
                  show_above_text: false,
                  url:
                    imageUrl ??
                    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTQydmU1ZmQ2ejcwY2h1cXp4ODg3eWNvaGc4YjlhMjNldnBzbmF2OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/njXxKcoVWY5hiEBS2w/giphy.gif',
                },
                parse_mode: 'MarkdownV2',
              } as InputTextMessageContent,
              // reply_markup: {
              //   inline_keyboard: [
              //     [
              //       {
              //         text: "Play",
              //         url: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME || "g3stgbot"}/appname`,
              //       },
              //     ],
              //   ],
              // },
            },
          ],
          {
            cache_time: 1,
          }
        );
      } catch (error) {
        console.error(error);
      }
    });
    bot.on('chosen_inline_result', async (ctx) => {
      const { query } = ctx.chosenInlineResult;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_id] = query.split(' ');

      // Validate inputs
      const { stickerId } = parseInlineQuerySchema({
        stickerId: _id,
      });
      const sticker = await db.sticker.findUnique({
        where: { id: stickerId },
      });
      if (!sticker) {
        logger.error({ stickerId }, `Sticker not found`);

        return;
      }
      const storage = PersistentDb.getInstance();
      const { chatType } = storage.getUserData(ctx.chosenInlineResult.from.id);
      if (!isChatTypeSupported(chatType)) return;

      const user = await db.user.findFirst({
        where: {
          Provider: {
            some: {
              Occ: {
                some: {
                  GMSymbolOCC: {
                    Sticker: {
                      some: {
                        id: stickerId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // 2 cases here
      const isOwner =
        user?.telegramId && +user.telegramId === ctx.chosenInlineResult.from.id;

      if (isOwner) {
        await rewardOwner({
          userId: user.id,
        });
      } else {
        await rewardSharerAndOwner();
      }

      storage.appendUserData(ctx.chosenInlineResult.from.id, {
        stickerId,
        chatType,
      });
      await db.sticker.update({
        where: { id: stickerId },
        data: {
          shareCount: {
            increment: 1,
          },
        },
      });

      async function rewardSharerAndOwner() {
        const sharer = await db.user.findFirstOrThrow({
          where: {
            telegramId: ctx.chosenInlineResult.from.id.toString(),
          },
        });
        // create account for user
        // reward for sharer
        if (!sharer) {
          const newSharer = await db.user.create({
            data: {
              telegramId: ctx.chosenInlineResult.from.id.toString(),
            },
          });

          if (!user?.id) {
            logger.error(`[CRITICAL] Owner of the sticker not found`);
            return;
          }

          await Promise.all([
            rewardService.rewardUser({
              taskId: QuestId.SHARING_FRIEND_STICKER,
              userId: newSharer.id,
              metadata: ctx.chosenInlineResult as unknown as Prisma.JsonObject,
            }),
            rewardService.rewardUser({
              taskId: QuestId.POINT_RECEIVED_FROM_FRIEND,
              userId: user.id,
              metadata: ctx.chosenInlineResult as unknown as Prisma.JsonObject,
            }),
          ]);
        } else {
          await rewardService.rewardUser({
            taskId: QuestId.SHARING_FRIEND_STICKER,
            userId: sharer.id,
            metadata: ctx.chosenInlineResult as unknown as Prisma.JsonObject,
          });
        }
      }

      async function rewardOwner({ userId }: { userId: number }) {
        await rewardService.rewardUser({
          userId,
          taskId: QuestId.SHARING_MY_STICKER,
        });
      }
    });
    bot.on('message', async (ctx) => {
      // delay 1s to make sure this callback will run after the chosen_inline_result
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { message } = ctx;

      switch (true) {
        case message.chat.type === 'supergroup': {
          // get from db
          const storage = PersistentDb.getInstance();
          const { chatType, stickerId } = storage.getUserData(message.from.id);

          if (!chatType || !stickerId) {
            logger.error(
              `[onMessage] chatType or stickerId not found in storage`,
              {
                chatType,
                stickerId,
              }
            );
            return;
          }

          const sticker = await db.sticker.findUnique({
            where: { id: stickerId },
          });

          if (!sticker) {
            logger.error(`[onMessage] Sticker not found, ID: ${stickerId}`, {
              stickerId,
            });
            return;
          }

          storage.resetUserData(message.from.id);
          const superGroupUsername = z.string().parse(message.chat.username);

          await db.share.create({
            data: {
              metadata: message as unknown as Prisma.JsonObject,
              messageId: message.message_id.toString(),
              superGroupUsername: superGroupUsername,
              stickerId,
            },
          });

          break;
        }
      }
    });
  }
}
