import { Module } from '@nestjs/common';
import { G3StickerCapturingEnvService } from './g3-sticker-capturing-env.service';

@Module({
  providers: [G3StickerCapturingEnvService],
  exports: [G3StickerCapturingEnvService],
})
export class G3StickerCapturingEnvModule {}
