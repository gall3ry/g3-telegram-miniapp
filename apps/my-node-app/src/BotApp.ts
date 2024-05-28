import { Prisma } from "database";
import express from "express";
import { Telegraf } from "telegraf";
import { InlineQueryResult, InputTextMessageContent } from "telegraf/types";
import { z } from "zod";
import { PersistentDb } from "./PersistentDb";
import { COMMANDS, MAP_COMMAND_TO_DESCRIPTION } from "./commands";
import { db } from "./utils/db";

// TODO: move to .env
const botToken = "7162609772:AAEM7x3Kfeta5CBesezv5gdD5youN6CsnBI";

export class BotApp {
  private static instance: BotApp;
  private bot = new Telegraf(botToken);

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
    bot.command(COMMANDS.greetings, (ctx) => ctx.reply("Hello!!!"));
    bot.command(COMMANDS.total_users, async (ctx) => {
      const totalUsers = await db.provider.count();
      await ctx.reply(`Total users: ${totalUsers}`);
    });
    bot.command(COMMANDS.share, async (ctx) => {
      await ctx.reply("Share this bot with your friends! 🚀", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Share",
                switch_inline_query: "play_game",
              },
            ],
          ],
        },
      });
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

        console.log({
          occEventId,
          occId,
        });

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
        ]);

        console.log(`Received inline query`, ctx.inlineQuery);

        const result: InlineQueryResult[] = [
          {
            type: "article",
            id: "1",
            title: `Join OCC ${occTemplate.name}`,
            thumbnail_url:
              "https://www.gall3ry.io/assets/landing/union/gall3ry-logo-squared.png",
            description: `Join OCC ${occTemplate.name}`,
            input_message_content: {
              message_text: `
@${ctx.inlineQuery.from.username} invites you to join 
                    
*TIN TON 💎🐈‍⬛ THE BIGGEST GAMING COMMUNITY 👾
                    
🚨 Farming LAUNCH 🚨
                    
🚀 Play Game 🚀
👨‍🎤 Join Clans 👩‍🎤
🐈‍⬛ Invite Cats 🐈‍⬛

💲 FARM $TINS 💲*`,
              link_preview_options: {
                prefer_large_media: true,
                prefer_small_media: false,
                show_above_text: false,
                url: "https://m3mefest.gall3ry.io/images/thumbnail.png",
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

        // Explicit usage
        await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

        if (!ctx.inlineQuery.from.username || !ctx.inlineQuery.chat_type) {
          // Do nothing
          return;
        }

        // Using context shortcut
        await ctx.answerInlineQuery(result);
      } catch (error) {
        console.error(error);
      }
    });

    bot.on("chosen_inline_result", async (ctx) => {
      console.log(`Received chosen inline result,`, ctx.chosenInlineResult);

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
      ]);

      const storage = PersistentDb.getInstance();
      storage.appendUserData(ctx.chosenInlineResult.from.id, {
        occEventId: +occEventId,
        occId: +occId,
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
          console.log(`User data`, userData);

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
          ]);

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

const app = express();
app.get("/", (_req, res) => {
  res.send("Bot is running");
});

const PORT = 3200;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
