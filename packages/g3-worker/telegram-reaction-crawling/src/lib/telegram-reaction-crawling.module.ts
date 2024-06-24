import { EmojiModule } from '@g3-worker/emoji';
import { EnvModule, EnvService } from '@g3-worker/env';
import { PrismaClientModule } from '@g3-worker/prisma-client';
import { TelegramModule } from '@g3-worker/telegram';
import { Module } from '@nestjs/common';
import { TelegramReactionCrawlingController } from './telegram-reaction-crawling.controller';
import { TelegramReactionCrawlingService } from './telegram-reaction-crawling.service';

@Module({
  imports: [
    PrismaClientModule,
    EnvModule,
    TelegramModule.registerAsync({
      inject: [EnvService],
      imports: [EnvModule],
      useFactory: async (envService: EnvService) => {
        return {
          apiHash: envService.get('TELEGRAM_API_HASH'),
          apiId: envService.get('TELEGRAM_API_ID'),
          stringSession: envService.get('TELEGRAM_STRING_SESSION'),
        };
      },
    }),
    EmojiModule,
  ],
  controllers: [TelegramReactionCrawlingController],
  providers: [TelegramReactionCrawlingService],
})
export class TelegramReactionCrawlingModule {}
