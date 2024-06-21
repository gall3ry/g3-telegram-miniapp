import { PrismaClientModule } from '@g3-worker/prisma-client';
import { G3StickerCapturingEnvModule } from '@gall3ry/g3-sticker-capturing-env';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUE_NAME } from './constants';
import { G3StickerCapturingController } from './g3-sticker-capturing.controller';
import { G3StickerCapturingProcessor } from './g3-sticker-capturing.processor';

@Module({
  imports: [
    PrismaClientModule,
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
    G3StickerCapturingEnvModule,
  ],
  providers: [G3StickerCapturingProcessor],
  controllers: [G3StickerCapturingController],
})
export class G3StickerCapturingModule {}
