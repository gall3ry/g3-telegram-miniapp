import { Telegraf } from "telegraf";
import { z } from "zod";

export class TelegramService {
  telegrafInstance: Telegraf;

  constructor(botApiKey: string) {
    this.telegrafInstance = new Telegraf(botApiKey);
  }

  async hasUserJoinedGroup({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: number;
  }): Promise<boolean> {
    return this.telegrafInstance.telegram

      .getChatMember(chatId, userId)
      .then((chatMember) => {
        const status = z
          .enum(["creator", "administrator", "member"])
          .safeParse(chatMember.status);

        return status.success;
      })
      .catch(() => {
        return false;
      });
  }
}
