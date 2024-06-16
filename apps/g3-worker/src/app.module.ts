import { TelegramReactionCrawlingService } from '@g3-worker/telegram-reaction-crawling';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [TelegramReactionCrawlingService],
})
export class AppModule {}
