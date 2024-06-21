import { G3StickerCapturingModule } from '@gall3ry/g3-sticker-capturing';
import {
  envSchema,
  G3StickerCapturingEnvModule,
  G3StickerCapturingEnvService,
} from '@gall3ry/g3-sticker-capturing-env';
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
      imports: [G3StickerCapturingEnvModule],
      useFactory: async (envService: G3StickerCapturingEnvService) => {
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
    G3StickerCapturingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
