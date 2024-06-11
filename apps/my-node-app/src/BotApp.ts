import { mapStickerTypeToStickerTemplate } from "@repo/types";
import { Prisma } from "database";
import { Telegraf } from "telegraf";
import { InputTextMessageContent } from "telegraf/types";
import { z } from "zod";
import { persistentDb, PersistentDb } from "./PersistentDb";
import { COMMANDS, MAP_COMMAND_TO_DESCRIPTION } from "./commands";
import { isChatTypeSupported } from "./constants";
import { env } from "./env";
import { parseInlineQuerySchema } from "./schema/parseInlineQuerySchema";
import { db } from "./utils/db";

export class BotApp {
  private static instance: BotApp;
  private bot = new Telegraf(env.BOT_TOKEN);

  private constructor() {}

  public static getInstance(): BotApp {
    if (!BotApp.instance) {
      BotApp.instance = new BotApp();
    }

    return BotApp.instance;
  }

  private _initializeCommands() {
    const bot = this.bot;

    bot.telegram.setMyCommands(
      Object.entries(MAP_COMMAND_TO_DESCRIPTION).map(
        ([command, description]) => ({
          command,
          description,
        })
      )
    );
    bot.command(COMMANDS.start, async (ctx) => {
      await ctx.reply(`👏 Welcome to Gall3ry Telegram MiniApp\!`);
    });
  }

  private _initializeListeners() {
    const bot = this.bot;

    bot.on("inline_query", async (ctx) => {
      try {
        // TODO: split to handlers
        const { query, from, chat_type } = ctx.inlineQuery;
        const [_id, _telegramUserId] = query.split(" ");

        console.log({
          _id,
          _telegramUserId,
        });

        const { stickerId, telegramUserId } = parseInlineQuerySchema({
          stickerId: _id,
          telegramUserId: _telegramUserId,
        });

        if (telegramUserId !== from.id) {
          console.log(
            `[MY NODE APP] telegramUserId not match, ID: ${telegramUserId}, from.id: ${from.id}`
          );
          return;
        }

        const sticker = await db.sticker.findUnique({
          where: { id: stickerId },
        });

        if (!sticker) {
          console.log(`[MY NODE APP] Sticker not found, ID: ${stickerId}`);
          return;
        }

        const { stickerType, imageUrl } = sticker;

        if (!from.username || !chat_type) {
          // This will not happen
          return;
        }

        // update user data
        console.log(`[MY NODE APP] Append user data`, {
          stickerId,
          chatType: chat_type,
        });
        persistentDb.appendUserData(ctx.inlineQuery.from.id, {
          stickerId,
          chatType: ctx.inlineQuery.chat_type,
        });

        // Explicit usage
        await ctx.telegram.answerInlineQuery(
          ctx.inlineQuery.id,
          [
            {
              type: "article",
              id: `${stickerId} ${from.id}`,
              title: mapStickerTypeToStickerTemplate[stickerType].title,
              thumbnail_url:
                "https://www.gall3ry.io/assets/landing/union/gall3ry-logo-squared.png",
              description:
                mapStickerTypeToStickerTemplate[stickerType].description,

              input_message_content: {
                message_text: "Good morning",
                link_preview_options: {
                  prefer_large_media: true,
                  prefer_small_media: false,
                  show_above_text: false,
                  url:
                    imageUrl ??
                    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTQydmU1ZmQ2ejcwY2h1cXp4ODg3eWNvaGc4YjlhMjNldnBzbmF2OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/njXxKcoVWY5hiEBS2w/giphy.gif",
                },
                parse_mode: "MarkdownV2",
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
    bot.on("chosen_inline_result", async (ctx) => {
      const { query } = ctx.chosenInlineResult;
      const [_id, _telegramUserId] = query.split(" ");

      const { stickerId, telegramUserId } = parseInlineQuerySchema({
        stickerId: _id,
        telegramUserId: _telegramUserId,
      });

      if (telegramUserId !== ctx.chosenInlineResult.from.id) {
        console.log(
          `[MY NODE APP] telegramUserId not match, ID: ${telegramUserId}, from.id: ${ctx.chosenInlineResult.from.id}`
        );
        return;
      }

      const sticker = await db.sticker.findUnique({
        where: { id: stickerId },
      });

      if (!sticker) {
        console.log(`[MY NODE APP] Sticker not found, ID: ${stickerId}`);
        return;
      }

      const storage = PersistentDb.getInstance();
      const { chatType } = storage.getUserData(ctx.chosenInlineResult.from.id);

      if (!isChatTypeSupported(chatType)) {
        return;
      }

      storage.appendUserData(ctx.chosenInlineResult.from.id, {
        stickerId,
        chatType,
      });

      // increase share
      await db.sticker.update({
        where: { id: stickerId },
        data: {
          shareCount: {
            increment: 1,
          },
        },
      });
    });
    bot.on("message", async (ctx) => {
      // delay 1s to make sure this callback will run after the chosen_inline_result
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { message } = ctx;

      switch (true) {
        case message.chat.type === "supergroup": {
          // get from db
          const storage = PersistentDb.getInstance();
          const { chatType, stickerId } = storage.getUserData(message.from.id);

          if (!chatType || !stickerId) {
            console.log(
              `[onMessage] chatType or stickerId not found in storage`
            );
            return;
          }

          const sticker = await db.sticker.findUnique({
            where: { id: stickerId },
          });

          if (!sticker) {
            console.log(`[MY NODE APP] Sticker not found, ID: ${stickerId}`);
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

  public async launch() {
    const bot = this.bot;
    this._initializeCommands();
    this._initializeListeners();

    console.log(`[MY NODE APP] ✅ Bot is running!`);

    if (process.env.environment == "PRODUCTION") {
      bot
        .launch({
          webhook: {
            domain: process.env.DOMAIN as string, // Your domain URL (where server code will be deployed)
            port: (process.env.PORT as unknown as number) || 8000,
          },
        })
        .then(() => {
          console.info(`The bot ${bot.botInfo?.username} is running on server`);
        });
    } else {
      // if local use Long-polling
      bot.launch().then(() => {
        console.info(`The bot ${bot.botInfo?.username} is running locally`);
      });
    }

    // Enable graceful stop
    process.once("SIGINT", () => {
      console.log("SIGINT");
      return bot.stop("SIGINT");
    });
    process.once("SIGTERM", () => {
      console.log("SIGTERM");
      return bot.stop("SIGTERM");
    });
  }
}
