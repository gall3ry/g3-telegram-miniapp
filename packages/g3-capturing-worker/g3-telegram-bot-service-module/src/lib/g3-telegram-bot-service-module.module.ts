import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './g3-telegram-bot-service-module.module-definition';
import { G3TelegramBotService } from './g3-telegram-bot-service-module.service';

@Module({
  providers: [G3TelegramBotService],
  exports: [G3TelegramBotService],
})
export class G3TelegramBotServiceModule extends ConfigurableModuleClass {}
