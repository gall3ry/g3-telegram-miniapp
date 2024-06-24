import { BaseModule } from '@g3-telegram-bot/types';
import { RewardService } from '@gall3ry/data-access-rewards';
import { Prisma } from '@gall3ry/database-client';
import { QuestId } from '@gall3ry/types';
import { Context, NarrowedContext } from 'telegraf';
import { InlineQueryResultCachedGif, Update } from 'telegraf/types';
import { z } from 'zod';
import { PersistentDb, persistentDb } from './persistent-db';
import { parseInlineQuerySchema } from './schema/parseInlineQuerySchema';

export class InlineQueryTrackerModule extends BaseModule {
  name = 'InlineQueryTrackerModule';
  description = 'Module to track inline query';

  async onInitializeListeners() {
    // Do nothing
  }

  async _selectOne({
    ctx,
    id,
  }: {
    ctx: NarrowedContext<Context<Update>, Update.InlineQueryUpdate>;
    id: number;
  }) {
    const { db, logger } = this;
    const { from, chat_type } = ctx.inlineQuery;

    // Validate inputs
    this.logger.debug({
      id,
    });
    const { stickerId } = parseInlineQuerySchema({
      stickerId: id,
    });
    const sticker = await db.sticker.findUnique({
      where: { id: stickerId },
    });
    if (!sticker) {
      this.logger.error({ stickerId }, `Sticker not found`);
      return;
    }

    const { imageUrl } = sticker;

    if (!from.username || !chat_type) {
      // This will not happen
      return;
    }

    persistentDb.appendUserData(ctx.inlineQuery.from.id, {
      stickerId,
      chatType: ctx.inlineQuery.chat_type,
    });

    const message = await ctx.telegram.sendAnimation(
      ctx.inlineQuery.from.id,
      imageUrl, // Assuming `imageUrl` is the URL or file path of the GIF
      {
        width: 1000,
        height: 1000,
        disable_notification: true,
      }
    );

    // Retrieve the file_id of the uploaded GIF
    const gifFileId = message.animation.file_id;
    logger.debug(gifFileId);

    await ctx.telegram.answerInlineQuery(
      ctx.inlineQuery.id,
      [
        {
          gif_file_id: gifFileId,
          id: stickerId.toString(),
          type: 'gif',
        } as InlineQueryResultCachedGif,
      ],
      {
        cache_time: 1,
      }
    );
  }

  async _uploadAnimation({
    ctx,
    url,
  }: {
    ctx: NarrowedContext<Context<Update>, Update.InlineQueryUpdate>;
    url: string;
  }) {
    const {
      animation: { file_id },
    } = await ctx.telegram.sendAnimation(
      ctx.inlineQuery.from.id,
      url, // Assuming `url` is the URL or file path of the GIF
      {
        disable_notification: true,
      }
    );
    return file_id;
  }

  async _selectMany({
    ctx,
  }: {
    ctx: NarrowedContext<Context<Update>, Update.InlineQueryUpdate>;
  }) {
    const telegramUserId = ctx.inlineQuery.from.id;
    const { db } = this;
    const stickers = await db.sticker.findMany({
      // take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        GMSymbolOCC: {
          Occ: {
            Provider: {
              User: {
                telegramId: telegramUserId.toString(),
              },
            },
          },
        },
      },
    });

    const results = await Promise.all(
      stickers.map(async (sticker) => {
        const { imageUrl, telegramFileId, id } = sticker;

        // Retrieve the file_id of the uploaded GIF
        let gif_file_id = telegramFileId;

        if (!gif_file_id) {
          gif_file_id = await this._uploadAnimation({
            url: imageUrl,
            ctx,
          });

          await db.sticker.update({
            where: { id: sticker.id },
            data: {
              telegramFileId: gif_file_id,
            },
          });
        }

        return {
          gif_file_id,
          id: id.toString(),
          type: 'gif',
        } as InlineQueryResultCachedGif;
      })
    );

    await ctx.answerInlineQuery(results, {
      cache_time: 1,
    });
  }

  async _get20NewestStickers(
    ctx: NarrowedContext<Context<Update>, Update.InlineQueryUpdate>
  ) {
    const { db } = this;
    const stickers = await db.sticker.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const results = await Promise.all(
      stickers.map(async (sticker) => {
        const { imageUrl, telegramFileId, id } = sticker;

        // Retrieve the file_id of the uploaded GIF
        let gif_file_id = telegramFileId;

        if (!gif_file_id) {
          gif_file_id = await this._uploadAnimation({
            url: imageUrl,
            ctx,
          });

          await db.sticker.update({
            where: { id: sticker.id },
            data: {
              telegramFileId: gif_file_id,
            },
          });
        }

        return {
          gif_file_id,
          id: id.toString(),
          type: 'gif',
        } as InlineQueryResultCachedGif;
      })
    );

    await ctx.answerInlineQuery(results, {
      cache_time: 30,
    });
  }

  async onInitializeCommands(): Promise<void> {
    const db = this.db;
    const logger = this.logger;
    const bot = this.bot;

    const rewardService = new RewardService(db);

    bot.on('inline_query', async (ctx) => {
      logger.debug({ ctx }, 'Inline query');
      try {
        // TODO: split to handlers
        const { query } = ctx.inlineQuery;
        const [id] = query.split(' ');

        const isRegistered = !!(await db.user.findFirst({
          where: {
            telegramId: ctx.inlineQuery.from.id.toString(),
          },
        }));
        const isSelectOne = id.length > 0;

        if (!isRegistered) {
          await this._get20NewestStickers(ctx);

          return;
        }

        if (isSelectOne) {
          const { success, data } = z.coerce.number().safeParse(id);

          if (!success) {
            await ctx.answerInlineQuery([], {
              cache_time: 1,
              button: {
                text: 'Invalid input',
                start_parameter: 'start',
                web_app: {
                  url: 'https://www.google.com',
                },
              },
            });
            return;
          }

          await this._selectOne({
            ctx,
            id: data,
          });
        } else {
          await this._selectMany({
            ctx,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
    bot.on('chosen_inline_result', async (ctx) => {
      const { result_id } = ctx.chosenInlineResult;

      // Validate inputs
      const { stickerId } = parseInlineQuerySchema({
        stickerId: result_id,
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
      // if (!isChatTypeSupported(chatType)) return;

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
