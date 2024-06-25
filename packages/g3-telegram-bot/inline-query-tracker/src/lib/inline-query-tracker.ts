import { BaseModule } from '@g3-telegram-bot/types';
import { RewardService } from '@gall3ry/data-access-rewards';
import { Prisma } from '@gall3ry/database-client';
import { QuestId } from '@gall3ry/types';
import { Context, NarrowedContext } from 'telegraf';
import { InlineQueryResultGif, Update } from 'telegraf/types';
import { z } from 'zod';
import { PersistentDb, persistentDb } from './persistent-db';
import { parseInlineQuerySchema } from './schema/parseInlineQuerySchema';

const URL_TO_WEB_APP = 'https://gall3ry.io';

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
    const { db } = this;
    const { from, chat_type } = ctx.inlineQuery;

    // Validate inputs
    const { stickerId } = parseInlineQuerySchema({
      stickerId: id,
    });
    const sticker = await db.sticker.findUnique({
      where: { id: stickerId },
    });
    if (!sticker) {
      ctx.answerInlineQuery([], {
        cache_time: 1,
        button: {
          text: 'Sticker not found',
          start_parameter: 'start',
          web_app: {
            url: URL_TO_WEB_APP,
          },
        },
      });
      return;
    }

    const { imageUrl } = sticker;

    if (!from.username || !chat_type || !imageUrl) {
      ctx.answerInlineQuery([], {
        cache_time: 1,
        button: {
          text: 'Invalid input',
          start_parameter: 'start',
          web_app: {
            url: URL_TO_WEB_APP,
          },
        },
      });

      return;
    }

    persistentDb.appendUserData(ctx.inlineQuery.from.id, {
      stickerId,
      chatType: ctx.inlineQuery.chat_type,
    });

    await ctx.answerInlineQuery(
      [
        {
          gif_url: imageUrl,
          id: stickerId.toString(),
          type: 'gif',
          thumbnail_url: imageUrl,
        } as InlineQueryResultGif,
      ],
      {
        cache_time: 1,
      }
    );
  }

  async _selectMany({
    ctx,
  }: {
    ctx: NarrowedContext<Context<Update>, Update.InlineQueryUpdate>;
  }) {
    const telegramUserId = ctx.inlineQuery.from.id;
    const { db, logger } = this;
    const stickers = await db.sticker.findMany({
      // take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        GMSymbolOCC: {
          Occ: {
            Provider: {
              type: 'TELEGRAM',
              value: telegramUserId.toString(),
            },
          },
        },
      },
    });

    logger.debug({ stickers, telegramUserId }, 'Stickers');

    const results = stickers
      .map((sticker) => {
        const { imageUrl, id } = sticker;

        if (!imageUrl) {
          return null;
        }

        return {
          gif_url: imageUrl,
          id: id.toString(),
          type: 'gif',
          thumbnail_url: imageUrl,
        } as InlineQueryResultGif;
      })
      .filter((result) => result !== null);

    if (results.length === 0) {
      await this._get20NewestStickers(ctx);

      return;
    }

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

    const results = stickers
      .map((sticker) => {
        const { imageUrl, id } = sticker;

        if (!imageUrl) {
          return null;
        }

        return {
          gif_url: imageUrl,
          id: id.toString(),
          type: 'gif',
          thumbnail_url: imageUrl,
        } as InlineQueryResultGif;
      })
      .filter((result) => result !== null);

    if (results.length === 0) {
      await ctx.answerInlineQuery([], {
        cache_time: 1,
        button: {
          text: 'No stickers found or your stickers are processing',
          start_parameter: 'start',
          web_app: {
            url: URL_TO_WEB_APP,
          },
        },
      });
      return;
    }

    await ctx.answerInlineQuery(results, {
      cache_time: 1,
    });
  }

  async onInitializeCommands(): Promise<void> {
    const db = this.db;
    const logger = this.logger;
    const bot = this.bot;

    const rewardService = new RewardService(db);

    bot.on('inline_query', async (ctx) => {
      try {
        // TODO: split to handlers
        const { query } = ctx.inlineQuery;
        const [id] = query.split(' ');

        const isRegistered = !!(await db.user.findFirst({
          where: {
            Provider: {
              some: {
                type: 'TELEGRAM',
                value: ctx.inlineQuery.from.id.toString(),
              },
            },
          },
        }));
        const isSelectOne = id.length > 0;

        if (isSelectOne) {
          const { success, data } = z.coerce.number().safeParse(id);

          if (!success) {
            await ctx.answerInlineQuery([], {
              cache_time: 1,
              button: {
                text: 'Invalid input',
                start_parameter: 'start',
                web_app: {
                  url: URL_TO_WEB_APP,
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
          if (!isRegistered) {
            await this._get20NewestStickers(ctx);

            return;
          }

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
        include: {
          Provider: true,
        },
      });

      // 2 cases here
      const isOwner = user.Provider.some((provider) => {
        return (
          provider.type === 'TELEGRAM' &&
          +provider.value === ctx.chosenInlineResult.from.id
        );
      });

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
        const sharer = await db.user.findFirst({
          where: {
            Provider: {
              some: {
                type: 'TELEGRAM',
                value: ctx.chosenInlineResult.from.id.toString(),
              },
            },
          },
        });
        // create account for user
        // reward for sharer
        if (!sharer) {
          const createData = {
            type: 'TELEGRAM',
            value: ctx.chosenInlineResult.from.id.toString(),
          } as const;

          const newSharer = await db.user.create({
            data: {
              Provider: {
                connectOrCreate: {
                  where: {
                    type_value: createData,
                  },
                  create: createData,
                },
              },
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

      if (ctx.message.from.id !== ctx.botInfo.id) return;

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
