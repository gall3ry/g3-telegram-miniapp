import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { z, ZodError } from 'zod';
import { AppService } from './app.service.js';
import { db } from './db.js';
import { env } from './env.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: 'Hello World!',
    };
  }

  private _captureGifSchema = z.object({
    occUUID: z.string(),
  });

  @Post('/webhook/occ/capture-gif')
  async getGif(@Body() body: any) {
    try {
      // TODO: validate upstash signature
      const { occUUID } = this._captureGifSchema.parse(body);

      const occ = await db.occ.findUniqueOrThrow({
        where: {
          uuid: occUUID,
        },
      });

      const imageUrl = await this.appService.getGif({
        url: `${env.FRONTEND_URL}/occ/${occ.id}?record=true`,
      });

      await db.occ.update({
        where: {
          id: occ.id,
        },
        data: {
          imageUrl,
        },
      });

      return {
        url: imageUrl,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(error.errors, 400);
      }

      console.error(error);

      throw new HttpException(error, 500);
    }
  }
}
