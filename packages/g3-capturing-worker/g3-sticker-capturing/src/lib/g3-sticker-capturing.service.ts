import { PrismaService } from '@g3-worker/prisma-client';
import { G3StickerCapturingEnvService } from '@gall3ry/g3-sticker-capturing-env';
import { G3TelegramBotService } from '@gall3ry/g3-telegram-bot-service-module';
import { Injectable } from '@nestjs/common';
import PQueue from 'p-queue';
import { Browser, chromium } from 'playwright';
import { z } from 'zod';

@Injectable()
export class G3StickerCapturingService {
  constructor(
    private db: PrismaService,
    private envService: G3StickerCapturingEnvService,
    private telegramService: G3TelegramBotService
  ) {}

  async getGif(payload: {
    stickerIds: number[];
  }): Promise<{ stickerId: number; cdnUrl: string }[]> {
    const db = this.db;

    console.log(`[getGif] Start, payload: ${JSON.stringify(payload)}`);
    const fn = z
      .function()
      .args(
        z.object({
          stickerIds: z.array(z.number()),
        })
      )
      .returns(
        z.promise(
          z.array(
            z.object({
              stickerId: z.number(),
              cdnUrl: z.string(),
            })
          )
        )
      )
      .implement(async ({ stickerIds }) => {
        let browser: Browser | null = null;
        try {
          const pqueue = new PQueue({ concurrency: 2 });
          browser = await chromium.launch({
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--no-first-run',
              '--no-zygote',
              '--disable-gpu',
            ],
          });

          const stickers = await db.sticker.findMany({
            where: {
              id: {
                in: stickerIds,
              },
            },
          });

          const result = await pqueue.addAll(
            stickers.map(({ id }) => async () => {
              const page = await browser.newPage({
                viewport: null,
              });
              const url = `${this.envService.get(
                'FRONTEND_URL'
              )}/stickers/${id}?record=true`;

              await page.goto(url);
              // add event listener (gif)
              const base64 = await page.evaluate(() => {
                return new Promise<string>((resolve, reject) => {
                  window.addEventListener('gif', (e: unknown) => {
                    const gif = e as CustomEvent<string>;

                    resolve(gif.detail);
                  });

                  setTimeout(() => {
                    reject(new Error('Timeout'));
                  }, 30 * 1000);
                });
              });
              const { url: cdnUrl } = await this._uploadGif({ base64 });

              if (page) await page.close();

              return {
                stickerId: id,
                cdnUrl,
              };
            })
          );

          return result;
        } catch (e) {
          console.error(e);
          throw e;
        } finally {
          if (browser) {
            await browser.close();
          }
        }
      });

    const result = await fn(payload);

    await this.telegramService.setStickers(result);
    return result;
  }

  private _uploadGif(payload: { base64: string }) {
    return z
      .function()
      .args(
        z.object({
          base64: z.string(),
        })
      )
      .implement(async ({ base64 }) => {
        //data:image/gif;base64
        const file = base64.replace(/^data:image\/gif;base64,/, '');

        const response = await fetch('https://api.akord.com/files', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Api-Key': 'IMHfyQuS4s6WOKzdJ1frI56WaxuuJ79qarJFekQq',
            'Content-Type': 'image/gif',
          },
          body: Buffer.from(file, 'base64'),
        });
        const result = await response.json();
        const url = result.cloud.url;

        return { url: url as string };
      })(payload);
  }
}
