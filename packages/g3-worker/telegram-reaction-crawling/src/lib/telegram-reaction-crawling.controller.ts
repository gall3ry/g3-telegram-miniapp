import { Controller, Get } from '@nestjs/common';
import { z } from 'zod';

@Controller()
export class TelegramReactionCrawlingController {
  @Get()
  getHello() {
    return {
      message: 'Hello World!',
    };
  }

  private _captureGifSchema = z.object({
    stickerIds: z.array(z.number()),
  });
}
