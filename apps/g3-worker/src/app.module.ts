import { EnvModule, envSchema, EnvService } from '@g3-worker/env';
import { TelegramReactionCrawlingModule } from '@g3-worker/telegram-reaction-crawling';
import { G3WorkerOccMintingModule } from '@gall3ry/g3-worker-occ-minting';
import { SampleModuleModule } from '@gall3ry/sample-module';
import { TelegramRecommendationModule } from '@gall3ry/telegram-bot-recommendation';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    BullModule.forRootAsync({
      imports: [EnvModule],
      useFactory: async (envService: EnvService) => {
        return {
          redis: {
            host: envService.get('REDIS_HOST'),
            port: envService.get('REDIS_PORT'),
            username: envService.get('REDIS_USERNAME'),
            password: envService.get('REDIS_PASSWORD'),
          },
        };
      },
      inject: [ConfigService],
    }),
    TelegramReactionCrawlingModule,
    TelegramRecommendationModule,
    SampleModuleModule,
    G3WorkerOccMintingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
