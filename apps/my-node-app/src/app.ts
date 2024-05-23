import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { InlineQueryResult } from "telegraf/types";

const botToken = "6963110935:AAFAgq9J5qo7Z3TL5YOWAmt1PQhCmke1_3U";
const bot = new Telegraf(botToken);

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on(message("text"), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.state.role}`
  );

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`);
});

bot.on("callback_query", async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on("inline_query", async (ctx) => {
  const result: InlineQueryResult[] = [
    {
      type: "article",
      id: "1",
      title: "Hello",
      input_message_content: {
        message_text: "Hello",
      },
    },
  ];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.launch();
console.log("Bot is up and running");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    bot?.stop();
  });
}
