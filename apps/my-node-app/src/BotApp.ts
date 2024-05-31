import { Prisma } from "database";
import { Telegraf } from "telegraf";
import { InlineQueryResult, InputTextMessageContent } from "telegraf/types";
import { z } from "zod";
import { PersistentDb } from "./PersistentDb";
import { COMMANDS, MAP_COMMAND_TO_DESCRIPTION } from "./commands";
import { isChatTypeSupported } from "./constants";
import { env } from "./env";
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
      await ctx.reply(`Hello @${ctx.from?.username}!`);
    });
  }

  private _initializeListeners() {
    const bot = this.bot;
    bot.on("callback_query", async (ctx) => {
      console.log(`Received callback query`, ctx.callbackQuery);

      // Explicit usage
      await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

      // Using context shortcut
      await ctx.answerCbQuery();
    });
    bot.on("inline_query", async (ctx) => {
      try {
        // TODO: split to handlers
        const { query } = ctx.inlineQuery;
        const regexp = new RegExp(/(\d+)-(\d+)/);
        const [occEventId, occId] = regexp.exec(query)?.slice(1) || [
          undefined,
          undefined,
        ];

        if (!occEventId || !occId) {
          return;
        }

        const [occTemplate] = await Promise.all([
          db.occTemplate.findUniqueOrThrow({
            where: { id: +occEventId },
          }),
          db.occ.findUniqueOrThrow({
            where: { id: +occId },
          }),
        ]).catch(() => {
          throw new Error(`[MY NODE APP] OCC template or OCC not found`);
        });

        const result: InlineQueryResult[] = [
          {
            type: "article",
            id: `${occEventId}-${occId}`,
            title: `OCC event ${occTemplate.name}`,
            thumbnail_url:
              "https://www.gall3ry.io/assets/landing/union/gall3ry-logo-squared.png",
            description: `Join OCC ${occTemplate.name}`,
            input_message_content: {
              message_text: `
@${ctx.inlineQuery.from.username}'s sticker
                    `,
              link_preview_options: {
                prefer_large_media: true,
                prefer_small_media: false,
                show_above_text: false,
                url: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTQydmU1ZmQ2ejcwY2h1cXp4ODg3eWNvaGc4YjlhMjNldnBzbmF2OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/njXxKcoVWY5hiEBS2w/giphy.gif",
              },
              parse_mode: "MarkdownV2",
            } as InputTextMessageContent,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    url: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME || "g3stgbot"}/appname`,
                  },
                ],
              ],
            },
          },
        ];

        if (!ctx.inlineQuery.from.username || !ctx.inlineQuery.chat_type) {
          // Do nothing
          return;
        }

        if (!isChatTypeSupported(ctx.inlineQuery.chat_type)) {
          // Do nothing
          console.log(
            `Not supported chat type: ${ctx.inlineQuery.chat_type}, ${ctx.inlineQuery.from.username}`
          );

          //  TODO: send that we are not support

          return;
        }

        // update user data
        const storage = PersistentDb.getInstance();
        storage.appendUserData(ctx.inlineQuery.from.id, {
          occEventId: +occEventId,
          occId: +occId,
          chatType: ctx.inlineQuery.chat_type,
        });

        // Explicit usage
        await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
      } catch (error) {
        console.error(error);
      }
    });
    bot.on("chosen_inline_result", async (ctx) => {
      const [occEventId, occId] =
        new RegExp(/(\d+)-(\d+)/)
          .exec(ctx.chosenInlineResult.query)
          ?.slice(1) || [];

      if (!occEventId || !occId) {
        return;
      }

      await Promise.all([
        db.occTemplate.findUniqueOrThrow({
          where: { id: +occEventId },
        }),
        db.occ.findUniqueOrThrow({
          where: { id: +occId },
        }),
      ]).catch(() => {
        throw new Error(`[MY NODE APP] OCC template or OCC not found`);
      });

      const storage = PersistentDb.getInstance();

      const { chatType } = storage.getUserData(ctx.chosenInlineResult.from.id);
      if (!isChatTypeSupported(chatType)) {
        return;
      }

      storage.appendUserData(ctx.chosenInlineResult.from.id, {
        occEventId: +occEventId,
        occId: +occId,
      });

      // increase share
      await db.occ.update({
        where: { id: +occId },
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
          const userData = storage.getUserData(message.from.id);

          const { occEventId, occId } = userData;

          if (!occId || !occEventId) {
            return;
          }

          await Promise.all([
            db.occTemplate.findUniqueOrThrow({
              where: { id: occEventId },
            }),
            db.occ.findUniqueOrThrow({
              where: { id: occId },
            }),
          ]).catch(() => {
            throw new Error(`[MY NODE APP] OCC template or OCC not found`);
          });

          // remove from storage
          storage.appendUserData(message.from.id, {
            occEventId: undefined,
            occId: undefined,
          });

          const superGroupUsername = z.string().parse(message.chat.username);

          await Promise.all([
            // ctx.reply(
            //   `Getting user data: ${occTemplate.name} (ID: ${occTemplate.id}), OCC ID: ${occ.id}`
            // ),

            db.share.create({
              data: {
                occId,
                metadata: message as unknown as Prisma.JsonObject,
                messageId: message.message_id.toString(),
                superGroupUsername: superGroupUsername,
              },
            }),
          ]);
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
