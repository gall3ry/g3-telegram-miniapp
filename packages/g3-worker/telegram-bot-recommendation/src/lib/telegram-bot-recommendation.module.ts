import { Module } from '@nestjs/common';
import { TelegramBotRecommendationService } from './telegram-bot-recommendation.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TelegramBotRecommendationService],
})
export class TelegramRecommendationModule {}
