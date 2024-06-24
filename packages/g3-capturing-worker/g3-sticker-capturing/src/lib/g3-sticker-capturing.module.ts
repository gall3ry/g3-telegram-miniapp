import { EnvModule } from '@g3-worker/env';
import { PrismaClientModule } from '@g3-worker/prisma-client';
import {
  G3StickerCapturingEnvModule,
  G3StickerCapturingEnvService,
} from '@gall3ry/g3-sticker-capturing-env';
import { G3TelegramBotServiceModule } from '@gall3ry/g3-telegram-bot-service-module';
import { Module } from '@nestjs/common';
import { G3StickerCapturingController } from './g3-sticker-capturing.controller';
import { G3StickerCapturingService } from './g3-sticker-capturing.service';

@Module({
  imports: [
    PrismaClientModule,
    EnvModule,
    G3StickerCapturingEnvModule,
    G3TelegramBotServiceModule.registerAsync({
      imports: [G3StickerCapturingEnvModule],
      inject: [G3StickerCapturingEnvService],
      useFactory: (
        g3StickerCapturingEnvService: G3StickerCapturingEnvService
      ) => ({
        botApiKey: g3StickerCapturingEnvService.get('TELEGRAM_BOT_API_KEY'),
      }),
    }),
  ],
  providers: [G3StickerCapturingService],
  controllers: [G3StickerCapturingController],
})
export class G3StickerCapturingModule {}
