import { PrismaService } from '@g3-worker/prisma-client';
import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { z, ZodError } from 'zod';
import { G3StickerCapturingService } from './g3-sticker-capturing.service';

@Controller()
export class G3StickerCapturingController {
  constructor(
    private readonly g3StickerCapturingService: G3StickerCapturingService,
    private readonly db: PrismaService
  ) {}

  private _captureGifSchema = z.object({
    stickerIds: z.array(z.number()),
  });

  @Post('/webhook/sticker/capture-gif')
  async getGif(@Body() body: unknown) {
    try {
      // TODO: validate upstash signature
      const { stickerIds } = this._captureGifSchema.parse(body);

      const result = await this.g3StickerCapturingService.getGif({
        stickerIds,
      });

      return Promise.all(
        result.map(async (sticker) => {
          return this.db.sticker.update({
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

  @Get('/webhook/sticker/capture-gif')
  async getGifTest() {
    return {
      success: true,
    };
  }
}
