import { Telegraf } from 'telegraf';
import { z } from 'zod';

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
          .enum(['creator', 'administrator', 'member'])
          .safeParse(chatMember.status);

        return status.success;
      })
      .catch(() => {
        return false;
      });
  }

  async getUserProfilePhoto({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<string> {
    return this.telegrafInstance.telegram
      .getUserProfilePhotos(telegramUserId)
      .then(async (photos) => {
        if (photos.total_count === 0) {
          throw new Error('User has no profile photos');
        }

        const fileLink = await this.telegrafInstance.telegram.getFileLink(
          photos.photos[0]?.[0]?.file_id
        );

        return fileLink.toString();
      });
  }
}
