import { Telegraf } from "telegraf";
import { InlineQueryResult, InputTextMessageContent } from "telegraf/types";

const botToken = "6963110935:AAFAgq9J5qo7Z3TL5YOWAmt1PQhCmke1_3U";
const bot = new Telegraf(botToken);

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

// bot.on(message("text"), async (ctx) => {
//   // Explicit usage
//   await ctx.telegram.sendMessage(
//     ctx.message.chat.id,
//     `Hello ${ctx.state.role}`
//   );

//   // Using context shortcut
//   await ctx.reply(`Hello ${ctx.state.role}`);
// });

// onupdate

bot.on("message", async (ctx) => {
  console.log("message", ctx.message);
});

bot.on("callback_query", async (ctx) => {
  console.log(`Received callback query`, ctx.callbackQuery);

  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on("inline_query", async (ctx) => {
  const a = JSON.stringify(ctx, null, 2);

  // save to file
  const fs = require("fs/promises");
  // override
  await fs.writeFile("inline_query.json", a);

  const result: InlineQueryResult[] = [
    {
      type: "article",
      id: "1",
      title: "Hello world",
      thumbnail_url: "https://api.dicebear.com/8.x/micah/png?seed=123",
      input_message_content: {
        message_text: `
@${ctx.inlineQuery.from.username} invites you to join 
                    
TIN TON 💎🐈‍⬛ THE BIGGEST GAMING COMMUNITY 👾
                    
🚨 Farming LAUNCH 🚨
                    
🚀 Play Game 🚀
👨‍🎤 Join Clans 👩‍🎤
🐈‍⬛ Invite Cats 🐈‍⬛

💲 FARM $TINS 💲`,
        link_preview_options: {
          prefer_large_media: true,
          prefer_small_media: false,
          show_above_text: false,
          url: "https://m3mefest.gall3ry.io/images/thumbnail.png",
        },
        entities: [
          {
            type: "bold",
            offset: 0,
            length: 3,
          },
        ],
      } as InputTextMessageContent,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Share",
              switch_inline_query_chosen_chat: {
                allow_bot_chats: true,
                allow_channel_chats: true,
                allow_group_chats: true,
                allow_user_chats: true,
                query: "play_game",
              },
            },
          ],
        ],
      },
    },
  ];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.on("chosen_inline_result", async (ctx) => {
  console.log(`Received chosen inline result,`, ctx.chosenInlineResult);
});

bot.launch();
console.log("Bot is up and running");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    console.log("Reloading...");
    bot?.stop();
  });
}
