import { EnvModule } from '@g3-worker/env';
import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Module({
  imports: [EnvModule],
  controllers: [],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
