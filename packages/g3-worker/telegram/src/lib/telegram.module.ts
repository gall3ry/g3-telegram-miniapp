import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './telegram.module-definition';
import { TelegramService } from './telegram.service';

@Module({
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule extends ConfigurableModuleClass {}
