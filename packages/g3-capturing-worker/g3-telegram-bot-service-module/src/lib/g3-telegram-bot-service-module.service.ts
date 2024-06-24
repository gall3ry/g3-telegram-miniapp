import { Inject, Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigModuleOptions } from './g3-telegram-bot-service-module.interface';
import { MODULE_OPTIONS_TOKEN } from './g3-telegram-bot-service-module.module-definition';

@Injectable()
export class G3TelegramBotService {
  private telegrafInstance: Telegraf;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: ConfigModuleOptions
  ) {
    const { botApiKey } = options;
    this.telegrafInstance = new Telegraf(botApiKey);
  }

  async setStickers(
    stickers: {
      cdnUrl: string;
      stickerId: number;
    }[]
  ) {
    Logger.debug(`[setStickers] Start, stickers: ${JSON.stringify(stickers)}`);

    // TODO: Implement this
    // this.telegrafInstance.telegram.createNewStickerSet(ownerId, stickerSetName, stickerTitle, {
    //   sticker_format: "animated",
    //   stickers: stickers.map((sticker) => ({
    //     // png_sticker: sticker.cdnUrl,
    //     // emojis: sticker.stickerId,
    //     sticker: {
    //       source: sticker.cdnUrl,
    //       url: sticker.cdnUrl,
    //     },
    //     emoji_list: [sticker.stickerId]
    //   })),
    // });

    // TODO: Implement this
    return {
      changeme: 'changeme',
    };
  }
}
