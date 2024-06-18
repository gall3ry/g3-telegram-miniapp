import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelegramBotRecommendationService {
  private readonly logger = new Logger(TelegramBotRecommendationService.name);

  // @Cron('0 */2 * * * *')
  // async recommend() {}
}
