import { EmojiModule } from '@g3-worker/emoji';
import { EnvModule } from '@g3-worker/env';
import { PrismaClientModule } from '@g3-worker/prisma-client';
import { TelegramModule } from '@g3-worker/telegram';
import { Module } from '@nestjs/common';
import { TelegramReactionCrawlingController } from './telegram-reaction-crawling.controller';
import { TelegramReactionCrawlingService } from './telegram-reaction-crawling.service';

@Module({
  imports: [PrismaClientModule, EnvModule, TelegramModule, EmojiModule],
  controllers: [TelegramReactionCrawlingController],
  providers: [TelegramReactionCrawlingService],
})
export class TelegramReactionCrawlingModule {}
