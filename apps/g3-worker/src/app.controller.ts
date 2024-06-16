import { TelegramReactionCrawlingService } from '@g3-worker/telegram-reaction-crawling';
import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { z, ZodError } from 'zod';
import { db } from './db';

@Controller()
export class AppController {
  constructor(
    private readonly telegramReactionCrawlingService: TelegramReactionCrawlingService
  ) {}

  @Get()
  getHello() {
    return {
      message: 'Hello World!',
    };
  }

  private _captureGifSchema = z.object({
    stickerIds: z.array(z.number()),
  });

  @Post('/webhook/sticker/capture-gif')
  async getGif(@Body() body: unknown) {
    try {
      // TODO: validate upstash signature
      const { stickerIds } = this._captureGifSchema.parse(body);

      const result = await this.telegramReactionCrawlingService.getGif({
        stickerIds,
      });

      return Promise.all(
        result.map(async (sticker) => {
          return db.sticker.update({
            where: {
              id: sticker.stickerId,
            },
            data: {
              imageUrl: sticker.cdnUrl,
            },
          });
        })
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(error.errors, 400);
      }

      console.error(error);

      throw new HttpException(error, 500);
    }
  }
}
