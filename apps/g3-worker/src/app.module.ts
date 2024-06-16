import { EmojiService } from '@g3-worker/emoji';
import { EnvModule, envSchema } from '@g3-worker/env';
import { PrismaService } from '@g3-worker/prisma-client';
import { TelegramService } from '@g3-worker/telegram';
import { TelegramReactionCrawlingService } from '@g3-worker/telegram-reaction-crawling';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
  ],
  controllers: [AppController],
  providers: [
    TelegramReactionCrawlingService,
    PrismaService,
    TelegramService,
    EmojiService,
  ],
})
export class AppModule {}
