import { Module } from '@nestjs/common';
import { EmojiService } from './emoji.service';

@Module({
  exports: [EmojiService],
  providers: [EmojiService],
})
export class EmojiModule {}
