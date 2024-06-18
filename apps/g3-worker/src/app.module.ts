import { envSchema } from '@g3-worker/env';
import { TelegramReactionCrawlingModule } from '@g3-worker/telegram-reaction-crawling';
import { TelegramRecommendationModule } from '@gall3ry/telegram-bot-recommendation';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AllExceptionsFilter } from './http-exception.filter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    TelegramReactionCrawlingModule,
    TelegramRecommendationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
